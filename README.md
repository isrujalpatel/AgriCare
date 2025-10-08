AgriCare — Frontend demo (GitHub Pages)
--------------------------------------
Folder structure:
- index.html, cart.html, orders.html, contact.html
- auth/login.html, auth/register.html
- assets/css/style.css
- assets/js/*.js
- assets/data/pesticides.json
- assets/images/image.jpg (home bg), assets/images/img.jpg (login bg)

Run locally:
1. Open folder in VS Code
2. Install Live Server extension
3. Right-click index.html -> Open with Live Server

Deploy on GitHub Pages:
- Push repository to GitHub
- Settings -> Pages -> Source: main branch (root)
- Wait a minute and open https://<username>.github.io/<repo>/

Notes:
- This site is demo-only. Login, cart, orders are client-side (localStorage).
- Replace product images with manufacturer/distributor images & attach correct label PDFs before selling.
