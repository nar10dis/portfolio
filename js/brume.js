// brume légère qui dérive sur la carte : un shader WebGL2 sur un canvas par-dessus #monde.
// pas de bruit calculé : on lit outils/bruit-usure.png (le même bruit que l'encre usée,
// il se répète sans couture), deux fois par couche à deux échelles pour casser la répétition.
//
// deux couches pour la profondeur : la lointaine suit la carte moins vite qu'elle (0.6),
// la proche plus vite (1.5) et s'efface quand on zoome, comme si on passait sous les nuages.
// tout est calculé à demi-résolution : la brume est floue, ça ne se voit pas.
// sans WebGL2 (ou ouvert en file://, l'image est alors refusée), pas de brume, rien d'autre ne change.

(() => {
    const RESOLUTION = 0.5;   // pixels du canvas par pixel CSS

    const canvas = document.createElement('canvas');
    canvas.id = 'brume';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    if (!gl)
        return;

    const vertex = `#version 300 es
        in vec2 a;
        void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

    const fragment = `#version 300 es
        precision highp float;
        uniform sampler2D uBruit;
        uniform vec2 uTaille;     // taille de l'écran en px CSS (repère du site)
        uniform vec2 uDecalage;   // décalage du centre de la carte par rapport au centre de l'écran
        uniform float uZ;         // zoom de la carte
        uniform float uTemps;     // secondes
        out vec4 couleur;

        // bruit-usure.png : moyenne ~0.80, écart-type ~0.17. on le recentre, puis on
        // ne garde que les bosses pour avoir des nappes de brume avec du clair entre elles
        float nappe(vec2 p, vec2 vent) {
            float a = texture(uBruit, p / 1700.0 + vent * uTemps).r;
            float b = texture(uBruit, p / 730.0 - vent.yx * uTemps * 1.6 + 0.37).r;
            float n = (0.65 * a + 0.35 * b - 0.80) / 0.13;
            return smoothstep(-0.6, 1.4, n);
        }

        void main() {
            vec2 f = gl_FragCoord.xy * ${(1 / RESOLUTION).toFixed(3)};
            f.y = uTaille.y - f.y;
            vec2 c = f - uTaille * 0.5;

            // couche lointaine : bouge et grossit moins que la carte
            vec2 pl = (c - 0.6 * uDecalage) / pow(uZ, 0.6);
            float loin = nappe(pl, vec2(0.0080, 0.0032)) * 0.32;

            // couche proche : bouge et grossit plus que la carte, disparaît en zoomant
            vec2 pp = (c - 1.5 * uDecalage) / pow(uZ, 1.5) + 517.0;
            float pres = nappe(pp, vec2(-0.0060, 0.0042)) * 0.25 * (1.0 - smoothstep(1.0, 2.6, uZ));

            float a = 1.0 - (1.0 - loin) * (1.0 - pres);
            couleur = vec4(vec3(0.96, 0.94, 0.89) * a, a);
        }`;

    function shader(type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(s));
        return s;
    }

    let programme;
    try {
        programme = gl.createProgram();
        gl.attachShader(programme, shader(gl.VERTEX_SHADER, vertex));
        gl.attachShader(programme, shader(gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(programme);
        if (!gl.getProgramParameter(programme, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(programme));
    }
    catch (e) {
        console.warn('brume désactivée :', e);
        return;
    }
    gl.useProgram(programme);

    // un triangle qui couvre tout l'écran
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(programme, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    const u = {};
    for (const nom of ['uTaille', 'uDecalage', 'uZ', 'uTemps'])
        u[nom] = gl.getUniformLocation(programme, nom);

    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)');
    let largeur = 0, hauteur = 0;
    let derniere = '';

    function dessine(maintenant) {
        requestAnimationFrame(dessine);

        // canvas.clientWidth est dans le repère du site, même couché sur téléphone
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (w !== largeur || h !== hauteur) {
            largeur = w;
            hauteur = h;
            canvas.width = Math.max(1, Math.round(w * RESOLUTION));
            canvas.height = Math.max(1, Math.round(h * RESOLUTION));
            gl.viewport(0, 0, canvas.width, canvas.height);
            derniere = '';
        }

        // même calcul que borneVue (js/zoom.js) : où est le centre de la carte
        const dx = vue.x + (vue.z - 1) * mesures.w / 2;
        const dy = vue.y + (vue.z - 1) * mesures.h / 2;

        // mouvement réduit : brume figée, on ne redessine que si la vue change
        const fige = reduit.matches;
        const etat = `${dx},${dy},${vue.z}`;
        if (fige && etat === derniere)
            return;
        derniere = etat;

        gl.uniform2f(u.uTaille, w, h);
        gl.uniform2f(u.uDecalage, dx, dy);
        gl.uniform1f(u.uZ, vue.z);
        gl.uniform1f(u.uTemps, fige ? 0 : maintenant / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    const image = new Image();
    image.onload = () => {
        try {
            gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, image);
        }
        catch (e) {
            console.warn('brume désactivée :', e);
            return;
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        document.body.appendChild(canvas);
        requestAnimationFrame(dessine);
    };
    image.src = 'outils/bruit-usure.png';
})();
