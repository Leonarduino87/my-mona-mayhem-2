# My Mona Mayhem Commands

## 01 Setup & Context Engineering

### startup dell'app

Per startare l'app, aprire il terminale nella project root

```powershell
npm install
npm run dev
```

### inizializzazione progetto
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

[documentazione /init](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#project-initialization-for-copilot)

### backgroud agents
- utilizzando il **local agent**

```text
Aggiungi regole di linting per le variabili inutilizzate e per migliorare lo stile del codice; Sistema ogni errore
```

- utilizzando il **cloud agent**

```text
Rendi il README più accattivante, in stile landing page
```

[documentazione agent harness](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)

## 02 Plan & Scaffold

## 03 Build the Game

## 04 Design-first Theming

## 05 Polish & Parallel Work

## 06 Bonus & Extension