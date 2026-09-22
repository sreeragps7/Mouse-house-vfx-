# Sreerosh Production — Client Gallery

Zenfolio-style client photo proofing for Sreerosh Production.

The application bundle is stored in `gallery-mvp.zip`. Netlify extracts it during deployment.

## Hosting

No custom .com domain is required.

1. Connect the GitHub repository to Netlify.
2. Select branch: `sreerosh-client-gallery`.
3. Set Base directory to: `sreerosh-client-gallery`.
4. Add the environment variables described in the bundle README:
   - `GOOGLE_SERVICE_ACCOUNT_JSON`
   - `GALLERY_CONFIG_JSON`
   - `GALLERY_SESSION_SECRET`
5. Deploy.

The site will be available on a free `*.netlify.app` URL and can be accessed anytime.

## Google Drive

Full-resolution wedding photos remain in Google Drive. The client gallery is password protected and streams only the gallery images through the serverless functions.

Client selections, notes, and annotation PNGs are written back to the gallery Drive folder.
