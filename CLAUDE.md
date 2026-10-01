# Products Recommender

Portal estático bilingüe (ES/EN) de recomendación de productos para personas 50+. La fuente de verdad del alcance es [SPEC.md](SPEC.md).

## Comandos
- `npm run build`: valida `data/` y genera el sitio en `dist/`.
- `npm start`: genera y sirve en http://localhost:8080/.
- `dist/` no se versiona; siempre se regenera.

## Regla de commits (pedida por el usuario)
- Hacer **un commit después de cada cambio** completado (código, datos, contenido, estilos o SPEC), para poder hacer rollback.
- Antes de cada commit, ejecutar `npm run build` y confirmar que termina sin errores.
- Mensajes en español, en imperativo y descriptivos (ej. "Agrega filtro de precio a páginas de sección").
- Un cambio lógico por commit; no mezclar cambios no relacionados.
- No reescribir el historial (`--amend`, `rebase`, `reset --hard`, `push --force`) sin pedirlo explícitamente.
