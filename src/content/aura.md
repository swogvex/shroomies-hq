---
# The aura reading (/aura/). The owner edits this file. Spanish reviewed by the owner 2026-11-27.
reviewed: true

# Feelings, in tie-break order. id = what questions and songs use; label = shown on the page; why = "Because <why>, and <why>."
feelings:
  - id: bedroom
    label: { en: Bedroom, es: Habitación }
    why: { en: you make big feelings in small rooms, es: haces sentimientos enormes en cuartos pequeños }
  - id: ache
    label: { en: Heartache, es: Herida }
    why: { en: you feel everything first and explain it later, es: lo sientes todo primero y lo explicas después }
  - id: bite
    label: { en: Fight back, es: Contraataque }
    why: { en: you turn the hurt into a plan, es: conviertes el dolor en un plan }
  - id: hope
    label: { en: Hope, es: Esperanza }
    why: { en: you keep choosing to get better, es: sigues eligiendo estar mejor }
  - id: nostalgia
    label: { en: Nostalgia, es: Nostalgia }
    why: { en: you keep a map of every place you have loved, es: guardas un mapa de cada lugar que has querido }
  - id: rave
    label: { en: Rave, es: Rave }
    why: { en: you'd rather dance than overthink, es: prefieres bailar a darle mil vueltas }
  - id: online
    label: { en: Online, es: Online }
    why: { en: your heart has a lot of tabs open, es: tu corazón tiene muchas pestañas abiertas }

# The four auras. Name and years come from src/content/eras/.
eras:
  first-singles:
    tag: { en: the bedroom era, es: la era del cuarto }
    line: { en: "Guitar, a cheap mic and very honest notes-app lyrics. Big feelings, small room.", es: "Guitarra, un micro barato y letras muy sinceras escritas en el móvil. Sentimientos grandes, cuarto pequeño." }
  projects:
    tag: { en: one EP per college year, es: un EP por año de universidad }
    line: { en: "Recovery, dependency, renewal, gratitude. You grow in public, on schedule.", es: "Recuperación, dependencia, renovación, gratitud. Creces en público y con calendario." }
  ltf:
    tag: { en: the meadow, es: la pradera }
    line: { en: "Soft synths, rabbits in a meadow, and missing people out loud.", es: "Sintes suaves, conejos en una pradera y extrañar a la gente en voz alta." }
  halo:
    tag: { en: the strobe, es: el estrobo }
    line: { en: "Huge drops under sad lyrics. Very online, and completely sure of it.", es: "Drops enormes bajo letras tristes. Muy online, y totalmente segura de ello." }

# Eight questions, four options each, in era order (A first singles, B projects, C LTF, D HALO).
# Each answer gives +2 to its era and +1 to each of its feelings. art = the small text drawn on the card (postcard, notification).
questions:
  - kicker: { en: NIGHT, es: NOCHE }
    text: { en: "It's 2 a.m. Where are you?", es: "Son las 2 a. m. ¿Dónde estás?" }
    kind: scene
    options:
      - { era: first-singles, feelings: [bedroom, ache], label: { en: Under the covers, es: Bajo las sábanas }, sub: { en: writing lyrics in my notes app, es: escribiendo letras en las notas del móvil } }
      - { era: projects, feelings: [bite, bedroom], label: { en: In a dorm stairwell, es: En la escalera de la residencia }, sub: { en: "headphones on, deadline tomorrow", es: "con cascos y una entrega mañana" } }
      - { era: ltf, feelings: [nostalgia, ache], label: { en: "Awake, scrolling old photos", es: "Despierta, mirando fotos viejas" }, sub: { en: "of home, of people I miss", es: "de casa, de gente que extraño" } }
      - { era: halo, feelings: [rave, online], label: { en: At a rave in a nail salon, es: En un rave en un salón de uñas }, sub: { en: "don't ask, it was amazing", es: "no preguntes, fue increíble" } }
  - kicker: { en: COLOUR, es: COLOR }
    text: { en: "Pick the aura you'd walk around in.", es: "Elige el aura con la que saldrías a la calle." }
    kind: swatch
    options:
      - { era: first-singles, feelings: [bedroom], label: { en: Soft lilac, es: Lila suave }, sub: { en: a lamp left on, es: una lámpara encendida } }
      - { era: projects, feelings: [bite], label: { en: Red-orange, es: Rojo anaranjado }, sub: { en: like a warning light, es: como una luz de alarma } }
      - { era: ltf, feelings: [nostalgia], label: { en: Meadow green, es: Verde pradera }, sub: { en: with a pink flash, es: con un destello rosa } }
      - { era: halo, feelings: [rave], label: { en: Strobe blue, es: Azul estrobo }, sub: { en: and flash white, es: y blanco flash } }
  - kicker: { en: BATTERY, es: BATERÍA }
    text: { en: "Your phone is on 3 %. Last move?", es: "Te queda 3 % de batería. ¿Último movimiento?" }
    kind: notif
    options:
      - { era: first-singles, feelings: [ache, online], art: { en: MESSAGES, es: MENSAJES }, label: { en: Text my crush, es: Escribirle a mi crush }, sub: { en: "something I'll regret by morning", es: "algo de lo que me arrepentiré mañana" } }
      - { era: projects, feelings: [bedroom, bite], art: { en: VOICE MEMOS, es: NOTAS DE VOZ }, label: { en: Record a voice memo, es: Grabar una nota de voz }, sub: { en: before the melody disappears, es: antes de que se me olvide la melodía } }
      - { era: ltf, feelings: [nostalgia, hope], art: { en: PHONE, es: TELÉFONO }, label: { en: Call my grandpa, es: Llamar a mi abuelo }, sub: { en: just to hear his voice, es: solo para oír su voz } }
      - { era: halo, feelings: [online, bite], art: { en: TIKTOK, es: TIKTOK }, label: { en: Post day 17, es: Subir el día 17 }, sub: { en: of the 30-day challenge, es: del reto de 30 días } }
  - kicker: { en: MAP, es: MAPA }
    text: { en: Pick a place., es: Elige un lugar. }
    kind: postcard
    options:
      - { era: first-singles, feelings: [nostalgia, bedroom], art: { en: KS, es: KS }, label: { en: "Wichita, KS", es: "Wichita, KS" }, sub: { en: a bedroom with a window over the fields, es: un cuarto con una ventana al campo } }
      - { era: projects, feelings: [hope, bite], art: { en: CA, es: CA }, label: { en: A campus in LA, es: Un campus en LA }, sub: { en: "four years, four chapters", es: "cuatro años, cuatro capítulos" } }
      - { era: ltf, feelings: [nostalgia, ache], art: { en: SF, es: SF }, label: { en: A San Francisco beach, es: Una playa de San Francisco }, sub: { en: at the end of the day, es: al final del día } }
      - { era: halo, feelings: [online, rave], art: { en: LA, es: LA }, label: { en: "LA, from a rooftop", es: "LA, desde una azotea" }, sub: { en: "at 3 a.m., city still on", es: "a las 3 a. m., con la ciudad encendida" } }
  - kicker: { en: HURT, es: DOLOR }
    text: { en: Someone hurt you. You…, es: Alguien te hizo daño. Tú… }
    kind: postit
    options:
      - { era: first-singles, feelings: [ache, bedroom], label: { en: write a sad song, es: escribes una canción triste }, sub: { en: and send it to nobody, es: y no se la mandas a nadie } }
      - { era: projects, feelings: [bite, hope], label: { en: make a plan, es: haces un plan }, sub: { en: and come back stronger, es: y vuelves más fuerte } }
      - { era: ltf, feelings: [nostalgia, ache], label: { en: miss how it used to be, es: extrañas cómo era antes }, sub: { en: and say it out loud, es: y lo dices en voz alta } }
      - { era: halo, feelings: [rave], label: { en: dance it off, es: lo sacas bailando }, sub: { en: until the drop wipes it out, es: hasta que el drop lo borra } }
  - kicker: { en: SOUND, es: SONIDO }
    text: { en: Slide the fader. Which sound is yours?, es: Mueve el fader. ¿Cuál es tu sonido? }
    kind: fader
    options:
      - { era: first-singles, feelings: [bedroom], label: { en: Acoustic guitar, es: Guitarra acústica }, sub: { en: and a cheap mic, es: y un micro barato } }
      - { era: projects, feelings: [bite], label: { en: Trap hi-hats, es: Hi-hats de trap }, sub: { en: and 808s, es: y 808 } }
      - { era: ltf, feelings: [nostalgia], label: { en: Soft synths, es: Sintes suaves }, sub: { en: with a little glitch, es: con un poco de glitch } }
      - { era: halo, feelings: [rave], label: { en: Sidechain, es: Sidechain }, sub: { en: and a huge drop, es: y un drop enorme } }
  - kicker: { en: TRUTH, es: VERDAD }
    text: { en: What do people get wrong about you?, es: ¿Qué es lo que la gente no entiende de ti? }
    kind: bubble
    options:
      - { era: first-singles, feelings: [ache], label: { en: "That I'm fine.", es: "Que estoy bien." } }
      - { era: projects, feelings: [hope], label: { en: "That I'll give up.", es: "Que me voy a rendir." } }
      - { era: ltf, feelings: [nostalgia, ache], label: { en: "That I've moved on.", es: "Que ya lo superé." } }
      - { era: halo, feelings: [online], label: { en: "That I'm just online.", es: "Que solo vivo en internet." } }
  - kicker: { en: STICKER, es: STICKER }
    text: { en: "Last one: pick a sticker for your backpack.", es: "La última: elige un sticker para tu mochila." }
    kind: sticker
    options:
      - { era: first-singles, feelings: [bedroom, hope], label: { en: Echo well, es: Pozo del eco }, sub: { en: where it all started, es: donde empezó todo } }
      - { era: projects, feelings: [bite, bedroom], label: { en: Mix for tiff, es: Mix para tiff }, sub: { en: "burned CD-R, 2022", es: "CD-R grabado, 2022" } }
      - { era: ltf, feelings: [nostalgia], label: { en: Bunny & fruit, es: Conejo y fruta }, sub: { en: from the meadow, es: de la pradera } }
      - { era: halo, feelings: [rave, online], label: { en: Flash, es: Flash }, sub: { en: strobe on, es: estrobo encendido } }

# Songs: title as in the discography → feelings (main first, then an optional second), explicit: true for the E tag,
# hidden: true to leave a song out. A song of hers missing here stays out of the reading and the build prints a warning.
songs:
  # first singles
  "Bubble": { feelings: [bedroom, hope] }
  "I Want My Money Back!": { feelings: [bite] }
  "CLOUT CHASER": { feelings: [online, bite] }
  "FLOWERS": { feelings: [bedroom, nostalgia] }
  "I'M ALIVE": { feelings: [hope, bite] }
  "FROOTY LOOPS": { feelings: [bedroom] }
  "SATISFIED?": { feelings: [online, bite] }
  "COMMITMENT ISSUES": { feelings: [ache, online] }
  "TWFNO": { feelings: [bite, online] }
  "I'm Sorry": { feelings: [ache] }
  "Autopilot": { feelings: [bedroom, ache] }
  "GROWNUP": { feelings: [nostalgia, bedroom] }
  "REVENGE": { feelings: [bite] }
  "Gonna Be Okay": { feelings: [hope, ache] }
  "You're So Fucking Mean To Me": { feelings: [ache, bite], explicit: true }
  "We Need To Talk": { feelings: [ache] }
  "I'm Overdramatic and I Miss You": { feelings: [ache, bedroom] }
  # the projects
  "PRETEND": { feelings: [ache, bedroom] }
  "TAKE ME BACK": { feelings: [nostalgia, ache] }
  "FEEL ALRIGHT": { feelings: [hope, ache] }
  "VULNERABLE": { feelings: [ache, bedroom] }
  "HOMESICK": { feelings: [nostalgia, ache] }
  "NIGHTS W U": { feelings: [bedroom, nostalgia] }
  "IF I DON'T TEXT YOU FIRST": { feelings: [online, ache] }
  "HANNA": { feelings: [ache, nostalgia] }
  "CALONE": { feelings: [ache, online] }
  "BAD HABITS": { feelings: [bite, online] }
  "SPOILED BITCH": { feelings: [bite, online], explicit: true }
  "BROKEN PLATES": { feelings: [bite, ache] }
  "BITE BACK": { feelings: [bite] }
  "ZILLOW HOUSES FOR SALE": { feelings: [nostalgia, online] }
  "CLOUDS": { feelings: [bedroom, hope] }
  "SAN FRANCISCO SIDEWALK": { feelings: [nostalgia, hope] }
  "SHOULD I BE OK?": { feelings: [ache, hope] }
  "PARTY W OUT ME": { feelings: [rave, ache] }
  "DREAMS ABT OPTIMISM": { feelings: [hope, bedroom] }
  "HEART TO HEART IN THE TATTOO PARLOR": { feelings: [hope, ache] }
  "APESHIT": { feelings: [rave, bite], explicit: true }
  # lover tofu fruit
  "ALWAYS FUN": { feelings: [rave, nostalgia] }
  "SIMON SAID": { feelings: [bite] }
  "FAR AWAY": { feelings: [nostalgia, ache] }
  "WHAT AM I RUNNING FROM": { feelings: [ache, rave] }
  "WHAT A JOKE": { feelings: [bite, online] }
  "LOYOLA": { feelings: [nostalgia] }
  "HELLA BOY CRAZY": { feelings: [online, rave] }
  "KANSAS": { feelings: [nostalgia, ache] }
  "TOGETHER": { feelings: [hope, nostalgia] }
  "LOVER TOFU FRUIT": { feelings: [nostalgia, bedroom] }
  # halo
  "EVERYTHING I'VE EVER WANTED": { feelings: [online, rave] }
  "DOIT4ME": { feelings: [rave, bite] }
  "SAME LA": { feelings: [nostalgia, online] }
  "PRETTY4U": { feelings: [online, ache] }
  "COPYCAT": { feelings: [bite, online] }
  "NO LUCK": { feelings: [ache] }
  "BREAKUP": { feelings: [ache, rave] }
  "TELL ME WHAT I DID": { feelings: [ache, online] }
  "START OVER": { feelings: [hope, rave] }
  "LOOK UP": { feelings: [hope, rave] }
  "AMERICAN GIRL": { feelings: [online, bite] }
  "FAREWELL TOLEDO": { feelings: [nostalgia, ache] }
  "IT'S NOT LIKE THAT ANYMORE": { feelings: [nostalgia, bite] }
  "CONSTANTLY": { feelings: [rave, ache] }
  "MEANT TO BE": { feelings: [hope, online] }
---
The aura reading: questions, feelings and the feelings of every song. Edit the fields above.
