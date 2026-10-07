# My Mona Mayhem Commands

## 01 Setup & Context Engineering

vedremo:
- sezione 1 - initial setup
- sezione 2 - context engineering

### sezione 1 - initial setup

Per startare l'app, aprire il terminale nella project root

```powershell
npm install
npm run dev
```

### sezione 2 - context engineering

#### task 1 - generare le workspace instructions

Usiamo il comando **/init** per inizializzare Copilot con delle istruzioni custom.
Queste istruzioni custom sono specifiche di progetto e sono delle guide che migliorano tutte le sessioni CLI del workspace

Solitamente queste istruzioni contengono:
- comandi di build, di test e comandi lint
- una panoramica architetturale
- convenzioni di codebase

Se il file esiste già, Copilot può suggerire delle migliorie da accettare o rigettare

```txt
/init Mantieni le istruzioni semplici. Includi una panoramica del progetto, i comandi di build/dev e le best practice di Astro. Ignora la cartella del workshop.
```

#### task 2 - Usiamo i background agents
Un agent harness è lo strato software che runna una agent session.
Trasforma il modello in un agent:
- fornendogli il contesto
- dandogli i tool
- coordinando l'**agent loop**
  - raccolta della richiesta
  - esecuzione
  - validazione del risultato
Ogni harness ha il suo set specifico di tool e di workflow.
Se il modello fornisce il ragionamento e decide o cosa dire o quale tool richiedere, l'harness rende queste decisioni operative all'interno di un workflow stateful, ovvero:
- prepara le richieste da dare al modello (prompt, available tools e context)
- coordina le chiamate ai tool
- gestisce gli approvals
- restituisce il risultato al modello
Ci sono quindi dei concetti legati all'harness che però non sono intercambiamili con l'harness stesso:
- il *modello*, che determina come l'agent ragiona e genera risposte
- l'*agent role*, che è l'insieme dei tool, delle istruzioni e del comportamento di un particolare agent. Cambiare un agent role non cambia l'harness
- l'*execution environment*, che è dove lavorano i tool e dove avvengono le modifiche (per esempio, locali, dev container o cloud)
- il *session target*, che è il selettore con cui si sceglie l'harness e anche l'execution environment. A volte l'execution environment è predefinito e non si può scegliere, altre volte invece lo si può indicare con un selettore a parte
Gli execution environments possono essere:
- il nostro pc
- un connected host, tramite SSH, Tunnel o WSL
- un Dev Container, che può girare sul nostro pc o in remoto. Richiede però l'Agent window
- un'infrastruttura cloud, quindi provisioned

Usiamo il **local agent**

```text
Aggiungi regole di linting per le variabili inutilizzate e per migliorare lo stile del codice; Sistema ogni errore
```

Usiamo il **cloud agent**

```text
Rendi il README più accattivante, in stile landing page
```

#### task 3 - esplorare il progetto

Esplorare il progetto con il **Copilot agent** in **Ask mode**

```text
Descrivimi l'architettura del progetto
```

### Part 1 Complete

Abbiamo:
- **settato il repo**
- **generato le istruzioni** con il comando **/init** così Copilot capisce il nostro progetto e le scelte di design
- **preso l'abitudine di rivedere le modifiche** prima di applicarle
- **esplorato la codebase**

<br />

## 02 Plan & Scaffold

vedremo:
- task 1 - pianificare l'architettura delle API
- task 2 - testare le API
- task 3 - pianificare la Battle Page
- task 4 - verificare lo scaffold

### Task 1 - Pianificare l'architettura API

Usiamo **Copilot** in **Plan mode**

```text
Ho bisogno di costruire un API proxy, lato server che sia in grado di raccogliere le GitHub contribution data per qualsiasi username dato. L'endpoint è https://github.com/{username}.contribs che restituisce un JSON. È necessario bypassare le restrizioni CORS. Pianifica l'implementazione includente la struttura della route, l'error handling e una strategia di caching
```

Durante il plan si 

Usiamo l'**Agent window**, nella stessa sessione, Usiamo il comando **/btw**

```text
/btw Spiegami meglio il problema CORS. Immagina che io sia uno junior. Sii discorsivo e spiegami il concetto con esempi
```

### Task 2 - Testare le API

Da terminale

```ps
curl http://localhost:4321/api/contributions/octocat
```

### Task 3 - Pianificare la Battle Page

Usiamo **Copilot** in **Plan mode**

```text
Devo creare la main page. Pianifica la battle page per "Mona Mayhem - GitHub
Contribution Battle Arena" con:
- 2 campi di input per gli username (Player 1 e Player 2)
- 1 pulsante per avviare la battaglia
- l'area per i risultati

Mantieni la UI semplice (in questa fase, non fare over-engineering sul layout o sullo stile).
Pianifica la struttura dell'HTML, lo stile di base e il funzionamento dell'interazione della battaglia
```

### Task 4 - Verificare lo Scaffold

Si apre il browser e si vedono:
- il titolo del gioco
- i due input per gli username (Player 1 e Player 2)
- il pulsante per la battaglia

### Part 2 Complete

Abbiamo:
- **pianificato prima di scrivere codice** invece che andare dritti sul codice
- **iterato i nostri plan** fino a quando l'architettura non era come volevamo noi
- **passati dal plan all'implementazione** con un workflow più pulito e sicuro

<br />

## 03 Build the Game

vedremo:
- task 1 - wire up the battle
- task 2 - test the battle
- task 3 - iterate with Copilot

### Task 1 - Wire Up the Battle

Usiamo **Copilot** in **Agent mode**

```text
Lato client-side, aggiungi del JavaScript che:
- quando viene premuto il pulsante di Battle, vengono raccolti entrambi gli username dagli input
- controlla che entrambi i campi siano pieni (e mostra un errore se non lo sono)
- raccoglie i dati di contribution di entrambi gli utenti in parallelo usando le API
- mostrare i grafici di contribution come griglie colorare: ciascun giorno è un quadrato colorato, usando la color palette di GitHub
- mostra un badge VS tra i due utenti
- mostra lo username, il totale di contribution e il date range per ciascun utente
- gestisce lo stato di caricamento ed eventuali errori
- si attiva anche se viene premuto il tasto Enter
- per il momento UI semplice che è già stata predisposta
```

### Task 2 - Test the Battle

Per testare:
- inserire **octocat** e **torvalds**
- l'app deve mostrare entrambi i grafici di contribution
- testare i casi d'errore:
  - lasciare uno o entrambi gli input vuoti e cliccare il pulsante Battle - deve comparire l'errore di validazione
  - inserire username invalido - l'app deve mostrare un errore dalle API

### Task 3 - Iterate with Copitot

Se qualcosa non va bene, si può continuare ad interagire con Copilot

```text
- i quadrati di contribution devono essere 12x12px
- aggiungi un hover tooltip che mostri le date e il count delle contribution
- il loading state ha bisogno di una animazione pulse
```

Suggerimenti:
- **essere specifici** su quello che si vuole perchè richieste chiare danno risultati migliori
- **dividere i task corposi** in prompt più piccoli se Copilot inizia a deviare
- **revisionare le modifiche prima di accettarle** perchè è più veloce revisionare il codice che riscriverlo dopo
- **testare l'app ad ogni passo** così i problemi rimangono localizzati

### Part 3 Complete

Abbiamo:
- **affinato i risultati** con prompt di follow-up
- **gestito l'intero ciclo della feature** ovvero implementazione, review, testing e refinement

<br />

## 04 Design-first Theming

Vedremo:
- task 1 - plan the retro theme
- task 2 - implement the theme
- task 3 - fine-tune the vibes
- task 4 - update instructions

### Task 1 - Plan the Retro Theme

Usiamo **Copilot** in **Plan mode** ma **NON accettiamo le proposte**

```text
Voglio trasformare questa pagina in un'esperienza arcade retrò a tutti gli effetti. Pianifica un restyling visivo completo che includa: effetti scanline CRT sullo sfondo, un bagliore al neon sul titolo che pulsa come un'insegna luminosa, un badge VS animato con transizioni di colore in gradiente, un effetto di riflesso luminoso (shine/shimmer) sulle card dei risultati utente, animazioni di ingresso fluttuante (float-in) per i campi di input, un testo di caricamento che cambia colore tra verde e viola, ed effetti glow al passaggio del mouse sui quadratini dei contributi. Mantieni lo sfondo scuro (#0a0a1a) con i colori d'accento verde (#5fed83) e viola (#8a2be2). Usa un tema scuro con il font retro gaming Press Start 2P di Google Fonts.
```

Prendiamo la proposta e la integriamo:

- integrazione 1
```text
Il bagliore al neon pulsa lentamente, circa 3 secondi.
```

- integrazione 2
```text
Dividi il piano in fasi: prima sfondo e tipografia, poi le animazioni, infine gli effetti hover. Così posso rivedere e testare ogni fase separatamente
```

### Task 2 - Implement the Theme

Usiamo **Copilot** in **Autopilot mode**

### Task 3 - Fine-Tune the Vibes

Usiamo **Copilot** in **Autopilot mode** e facciamo fine-tune:

- fine-tune 1

```text
l'effetto scanline è troppo debole, aumenta l'opacità di 0.03
```

- fine-tune 2

```text
aggiungi al titolo uno sfarfallio elettrico
```

- fine-tune 3

```text
il badge VS deve pulsare più marcatamente
```

### Task 4 - Update Instructions

Aggiorniamo le istruzioni di **Copilot**

```text
Aggiungi una sezione per il design nel documento AGENTS.md che descriva il nostro retro arcade theme: colori, fonts e animation style
```

### Part 4 Complete

Abbiamo:
- usato un planning workflow per abbozzare **il design prima di implementarlo**
- **affinato la UI** con prompt di follow-up
- **aggiornato le istruzioni dopo decisioni importanti** per mantenere Copilot consistente con la parte visuale
<br />

## 05 Polish & Parallel Work

Vedremo:
- 

### Part 5 Complete

Abbiamo:
- ****

<br />

## 06 Bonus & Extension

Vedremo:
- 

### Part 6 Complete

Abbiamo:
- ****

<br />

## Referenze
[/init](https://docs.github.com/en/Copilot/reference/Copilot-cli-reference/cli-command-reference#project-initialization-for-Copilot)
[agent harnessess](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)
[choose an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses)