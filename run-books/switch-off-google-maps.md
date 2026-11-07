# Switch off Google Maps on the Fahari booking page

Use this when Google Maps spend on the Fahari booking page needs to stop, so Google stops charging for address suggestions and the pickup map.

The Google Cloud budget for the Maps APIs emails alerts as monthly spend crosses each threshold:

- **50%**: heads up. Check usage in **Google Maps Platform → Metrics** for a spike that doesn't match real bookings.
- **90%**: switch off (below).
- **100%**: should already be off. If not, switch off now.

Budget alerts can lag spend by several hours, so a sudden spike can pass 100% before the email arrives.

The booking page uses two Google APIs, both in the Google Cloud project that holds the Fahari Maps API key:

- **Places API (New)** gives the pickup address suggestions.
- **Maps JavaScript API** loads Google on the page and draws the pickup map.

With both off, guests see a plain pickup textbox with no suggestions and no map. They can still type an address and submit, and the ride request reaches the backend as usual. No deploy is needed.

## Switch off

1. Open Google Cloud console and select the project that holds the Fahari Maps API key.
2. Go to **APIs & Services → Enabled APIs & services**.
3. Open **Places API (New)** and click **Disable API**. Confirm.
4. Open **Maps JavaScript API** and click **Disable API**. Confirm.

Google can take a few minutes to apply this. Guests already on the page keep any suggestions they've loaded, then fall back to the plain textbox.

Do not delete or regenerate the API key. The key is baked into the frontend at build time (`VITE_GOOGLE_MAPS_API_KEY` in Vercel), so a new key needs a Vercel env change and a redeploy. Disabling and re-enabling the APIs keeps the same key.

## Check

Open the booking page in a private window, reload, and type at least 3 letters into **Pick me up from**. No suggestion list should appear, and the field should keep what you typed.

## Switch back on

When spend is back under control (new billing month, or the budget raised):

1. Go to **APIs & Services → Library**.
2. Search for **Places API (New)** and click **Enable**.
3. Search for **Maps JavaScript API** and click **Enable**.

Guests get suggestions again after they reload the page.
