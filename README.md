# ClickGameAlt

Ett enkelt spel som går ut på att samla så många poäng som möjligt på en minut. Spelet har en highscore-lista där spelare kan mäta sig mot varandra, denna listan hämtas från en google sheet via ett API.

## Funktionalitet
* **Starta spelet:** Timern/nedräkningen startar när du klickar på poängknappen.
* **Tiden är ute:** När 60 sekunder gått, försvinner klick-knappen och texten uppdateras till *"Dina poäng blev"*. Ett formulär dyker upp där spelarnamn skrivs in.
* **Skicka in resultat:** Spelarens resultat skickas (vid tryck på skicka-knappen) till en databas via Zapier Webhooks. Resultatet landar också i ett publikt google sheet (som i sin tur använder API-inhämtning).

## Datahantering/API:er
Highscore-listan laddas in när sidan öppnas med viss fördröjning. Datan hämtas från ett externt Google Sheet via ett API. 

För att säkerställa utseende av listan och att den inte kraschar, hanteras listbojekten/resultaten genom funktionen `renderScoreboard()` innan den visas i HTML-DOM:en. 

Funktionen gör följande steg:
1. **Validering:** Kontrollerar först att den hämtade datan faktiskt är en array.
2. **Formatering (`.map`):** Går igenom alla spelare och rensar datan. Namn-inputen omvandlas till en textsträng med `String()` för att funktionen `.trim()` säkert ska kunna ta bort eventuella mellanslag i början och slutet. Om ett namn helt saknas tilldelas användaren namnet *"Anonym spelare"*. Poängen tvingas också att tolkas som nummer.
3. **Filtrering (`.filter`):** Tar bort alla rader där poängen är 0 eller där värdet inte är ett nummer (`isNaN`).
4. **Sortering (`.sort`):** Sorterar listan i fallande ordning så att den med högst poäng alltid hamnar överst.

## Några lärdomar från projektet
Under utvecklingen stötte jag på problem med att skicka in data (POST-requests) till Zapier. Webbläsaren blockerade anropet på grund av säkerhetsregler. Lösningen var att sätta `mode: "no-cors"` i fetch-anropet, vilket tillät min kod att skicka iväg poängen utan att webbläsaren krävde specifika headers tillbaka från servern. Nackdelen är
att JavaScript-koden inte kan läsa av om Zapier tyckte datan var bra eller dålig, du kan bara anta att den kom fram = får inte felmeddelanden gällande om POST-request fungerade.

En annan lärdom var när hela scoreboardet/listan slutade visas på grund av att någon lagt in namn med siffror. Min tidigare kod använde used trim  för att formatera array-objects (spelarnamnen) och ta bort mellanslag innan efter text. Eftersom jag inte tvingat/omvandlat objekten till textsträngar innan, kraschade scoreboardet när någon sedan lade in
namn som innehöll siffror. Detta löstes genom att lägga till string-functionen på spelarnamnen.
