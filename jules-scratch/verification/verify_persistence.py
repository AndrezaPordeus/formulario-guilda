
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # Handle the alert dialog that appears on successful submission
        page.on("dialog", lambda dialog: dialog.accept())

        page.goto("http://localhost:5173/")

        # 1. Fill out the form
        page.locator('input[name="nome"]').fill("Test Member")
        page.locator('select[name="classe"]').select_option("Guerreiro")
        page.locator('select[name="funcao"]').select_option("Tank")
        page.locator('input[name="nivel"]').fill("80")
        page.locator('input[name="disponibilidade"]').fill("Weekends")
        page.locator('textarea[name="apresentacao"]').fill("Test presentation")

        # 2. Submit the form
        page.locator('button[type="submit"]').click()

        # 3. Verify the member is added to the list *before* reloading
        expect(page.locator("text=Test Member")).to_be_visible(timeout=5000)

        # 4. Reload the page to test persistence
        page.reload()
        page.wait_for_load_state("domcontentloaded") # Wait for the page to be ready

        # 5. Verify the member is still visible *after* reload
        expect(page.locator("text=Test Member")).to_be_visible(timeout=5000)

        # 6. Take screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
