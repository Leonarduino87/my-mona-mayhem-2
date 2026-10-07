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

Usare il comando **/init** per inizializzare Copilot con delle istruzioni custom.
Queste istruzioni custom sono specifiche di progetto e sono delle guide che migliorano tutte le sessioni CLI del workspace

Solitamente queste istruzioni contengono:
- comandi di build, di test e comandi lint
- una panoramica architetturale
- convenzioni di codebase

Se il file esiste già, Copilot può suggerire delle migliorie da accettare o rigettare

```txt
/init Mantieni le istruzioni semplici. Includi una panoramica del progetto, i comandi di build/dev e le best practice di Astro. Ignora la cartella del workshop.
```

#### task 2 - usare i background agents
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

Usare il **local agent**

```text
Aggiungi regole di linting per le variabili inutilizzate e per migliorare lo stile del codice; Sistema ogni errore
```

Usare il **cloud agent**

```text
Rendi il README più accattivante, in stile landing page
```

#### task 3 - esplorare il progetto

Esplorare il progetto con il **copilot agent** in **Ask mode**

```text
Descrivimi l'architettura del progetto
```

### Part 1 Complete

Abbiamo:
- **settato il repo**
- **generato le istruzioni** con il comando **/init** così copilot capisce il nostro progetto e le scelte di design
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

Usare **copilot** in **Plan mode**

```text
Ho bisogno di costruire un API proxy, lato server che sia in grado di raccogliere le GitHub contribution data per qualsiasi username dato. L'endpoint è https://github.com/{username}.contribs che restituisce un JSON. È necessario bypassare le restrizioni CORS. Pianifica l'implementazione includente la struttura della route, l'error handling e una strategia di caching
```

Durante il plan si 

Usare l'**Agent window**, nella stessa sessione, Usare il comando **/btw**

```text
/btw Spiegami meglio il problema CORS. Immagina che io sia uno junior. Sii discorsivo e spiegami il concetto con esempi
```

### Task 2 - Testare le API

Da terminale

```ps
curl http://localhost:4321/api/contributions/octocat
```

### Task 3 - Pianificare la Battle Page

Usare **copilot** in **Plan mode**

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
- task 3 - iterate with copilot

### Task 1 - Wire Up the Battle

Usare **copilot** in **Agent mode**

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

Se qualcosa non va bene, si può continuare ad interagire con copilot

```text
- i quadrati di contribution devono essere 12x12px
- aggiungi un hover tooltip che mostri le date e il count delle contribution
- il loading state ha bisogno di una animazione pulse
```

Suggerimenti:
- **essere specifici** su quello che si vuole perchè richieste chiare danno risultati migliori
- **dividere i task corposi** in prompt più piccoli se copilot inizia a deviare
- **revisionare le modifiche prima di accettarle** perchè è più veloce revisionare il codice che riscriverlo dopo
- **testare l'app ad ogni passo** così i problemi rimangono localizzati

### Part 3 Complete

Abbiamo:
- **affinato i risultati** con prompt di follow-up
- **gestito l'intero ciclo della feature** ovvero implementazione, review, testing e refinement

<br />

## 04 Design-first Theming

<br />

## 05 Polish & Parallel Work

<br />

## 06 Bonus & Extension

<br />

## referenze
[/init](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#project-initialization-for-copilot)
[agent harnessess](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)
[choose an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses)