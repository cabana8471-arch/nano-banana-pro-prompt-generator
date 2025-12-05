# Agent pentru Rezolvarea Issues din Rapoarte de Evaluare

$ARGUMENTS

---

## 🎯 REGULI DE AUR (OBLIGATORIU)

```
1. UN issue complet → UN commit IMEDIAT (nu acumula)
2. NU trece la următorul până nu e 100% rezolvat
3. Definition of Done: phpcs CLEAN + teste PASS + problema ELIMINATĂ
4. La final OBLIGATORIU: git push + RAPORT FINAL
5. Blocat? → Documentează + marchează BLOCKED + continuă
6. Context limitat? → Finalizează issue curent → FAZA 3 → SESSION STATE
```

**⛔ NU TERMINA SESIUNEA fără: PUSH + RAPORT FINAL**

---

## FAZA 0: VERIFICARE INIȚIALĂ

```bash
git status              # Trebuie: clean working tree
git fetch origin && git status  # Trebuie: up to date cu remote
composer test           # Trebuie: PASS (baseline)
```
**Dacă ceva FAIL → STOP, raportează utilizatorului înainte de a continua**

---

## FAZA 1: SETUP

Creează TODO list cu TOATE issues-urile:
- Status: `pending` → `in_progress` → `completed`
- NU marca `completed` până nu trece Definition of Done

---

## FAZA 2: PENTRU FIECARE ISSUE (execută în ordine)

### 2.1 INVESTIGARE

1. **Citește codul** - înțelege contextul complet
2. **Identifică ROOT CAUSE** - de ce există problema, nu doar ce e
3. **Caută pattern-ul** în tot codul (grep/search) - rezolvă TOATE aparițiile
4. **Verifică dependențe** - ce depinde de codul modificat?

### 2.2 VERIFICĂ: E REAL sau FALSE POSITIVE?

**Dacă FALSE POSITIVE:**
```
[ISSUE-ID] - FALSE POSITIVE
Motiv: [explicație]
Justificare: [referință cod]
```
→ Marchează `FALSE_POSITIVE` → treci la următorul issue

### 2.3 PLANIFICĂ

- Ce fișiere trebuie modificate?
- Ce funcționalități sunt afectate?
- Există teste de actualizat?

### 2.4 IMPLEMENTEAZĂ

- Fix pas cu pas, explicând fiecare schimbare
- Rezolvă în TOATE locurile, nu doar primul
- Corectează TOATE erorile PHPCS din fișierele deschise
- Păstrează backward compatibility

**Dacă fix-ul DEZVĂLUIE alt issue:**
→ Notează `[NEW] descriere - file.php:123` → rezolvă DUPĂ issue-ul curent

**⚠️ STOP & ROLLBACK dacă:**
- `> 3 erori noi` în phpcs
- `> 3 teste` fail
- `> 10 fișiere` pentru un singur issue
- Schimbi semnătura funcției publice fără backward compat

### 2.5 VALIDEAZĂ (Definition of Done - TOATE obligatorii)

```bash
# 1. PHPCS clean pe fișierele modificate
./vendor/bin/phpcs [fisiere_modificate]

# 2. Teste pass
composer test

# 3. Verificări specifice per tip issue:
# SEC-*: grep -n "esc_html\|esc_attr\|wp_kses\|sanitize" [fisier]
# PERF-*: grep -n "->get_results\|->query\|WP_Query" [fisier]
# QUAL-*: ./vendor/bin/phpcs --sniffs=Generic.Metrics.CyclomaticComplexity [fisier]
```

**Checklist:**
- [ ] Problema nu mai apare în locul raportat
- [ ] Problema nu mai apare NICĂIERI în cod (verificat cu search)
- [ ] phpcs: 0 errors, 0 warnings pe fișierele modificate
- [ ] Toate testele pass
- [ ] Nu s-au introdus regresii

**⚠️ IMPORTANT: Fix STABIL și DEFINITIV (nu minimal!)**
```
✓ STABIL = rezolvă problema 100%, nu va reveni NICIODATĂ
✓ DEFINITIV = nu necesită revenire pe viitor
✗ PARȚIAL = rezolvă doar simptomul, problema revine (INACCEPTABIL)
✗ WORKAROUND = soluție temporară care mascează problema (INACCEPTABIL)
```
Un fix este "definitiv" când:
1. Elimină ROOT CAUSE-ul, nu doar simptomul
2. Acoperă TOATE cazurile edge
3. Este robust la schimbări viitoare în cod
4. Alt developer poate înțelege și menține fix-ul

### 2.6 DOCUMENTEAZĂ (pentru raportul final)

Pentru fiecare issue rezolvat, notează:
- Root cause identificat
- Fișiere modificate
- De ce fix-ul este definitiv

### 2.7 COMMIT IMEDIAT

```bash
git add [fisierele_modificate]
git commit -m "[ISSUE-ID] Fix: descriere scurtă"
```

**→ REPEAT pentru următorul issue**

---

## FAZA 3: FINALIZARE (OBLIGATORIU - NU SĂRI!)

### 3.1 Verifică TODO List

- [ ] TOATE issues = `completed` sau `BLOCKED`/`ESCALATED`
- [ ] NICIUN issue `pending` sau `in_progress` rămas

### 3.2 Validare Finală

```bash
# PHPCS pe întreg proiectul
./vendor/bin/phpcs

# Toate testele
composer test
```

### 3.3 PUSH

```bash
git push origin [branch-name]
git status  # Trebuie: "Your branch is up to date"
```

### 3.4 RAPORT FINAL (afișează OBLIGATORIU)

```
════════════════════════════════════════════════════════════════
                    RAPORT FINAL SESIUNE
════════════════════════════════════════════════════════════════

📊 SUMAR:
   • Total issues primite: X
   • ✅ Rezolvate complet: Y
   • ❌ Blocked/Escalated: Z
   • 🔄 False Positives: W

📁 FIȘIERE MODIFICATE: [lista]

🔧 COMMITS:
   • [hash] [ISSUE-ID] mesaj

📤 GIT STATUS:
   • Branch: [nume]
   • Pushed: DA/NU
   • Clean: DA/NU

⚠️ ISSUES RĂMASE: [dacă există - motiv + next steps]
════════════════════════════════════════════════════════════════
```

---

## ANEXA A: CAZURI SPECIALE

### A.1 Issue BLOCKED

Când nu poți rezolva complet:
1. Documentează CE blochează (lipsă acces, depinde de alt issue, etc.)
2. Propune WORKAROUND temporar dacă există: `// TODO: [ISSUE-ID] workaround`
3. Marchează `BLOCKED` în TODO (nu `completed`)
4. **Continuă cu următorul issue**

### A.2 ESCALATION (oprește și cere decizie)

**Escalează IMEDIAT dacă fix-ul necesită:**
- Schimbări în baza de date
- Modificări în logica de business neclară
- Afectează integrări externe (API-uri, payment)
- Risc major de securitate
- Cod legacy critic fără teste

```
[ISSUE-ID] - NEEDS ESCALATION
Motiv: [explicație]
Risc: [impact dacă continui]
Propuneri: [opțiuni cu pro/contra]
```
→ Marchează `ESCALATED` → continuă cu alte issues

### A.3 Sesiune Întreruptă (Context Preservation)

Dacă trebuie să oprești înainte de a termina:

```markdown
## SESSION STATE - [DATA]

### Completed:
- [ISSUE-ID]: ✓ [rezumat]

### In Progress:
- [ISSUE-ID]: 🔄 [ce s-a făcut] [ce rămâne] [git status]

### Pending:
- [ISSUE-ID]: ⏳

### Next Session Notes:
- [dependențe, blocaje, context important]
```

---

## ANEXA B: EXEMPLU CONCRET

### SEC-045: Unescaped output in admin dashboard

**INVESTIGARE:**
- Root cause: `echo $stats['total']` fără escape la linia 123
- Pattern găsit și în: linia 145, 189

**IMPLEMENTARE:**
```php
// BEFORE (linia 123):
echo $stats['total'];

// AFTER:
echo esc_html( $stats['total'] );
```

**VALIDARE:**
```bash
./vendor/bin/phpcs admin/dashboard.php  # ✓ 0 errors
composer test                            # ✓ PASS
```

**COMMIT:**
```bash
git commit -m "[SEC-045] Fix: Escape output in admin dashboard stats"
```
