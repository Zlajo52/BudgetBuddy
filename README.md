# BudgetBuddy

**Pametni osobni financijski planer za učenike**

## Opis projekta
BudgetBuddy je web aplikacija namijenjena učenicima i studentima s ciljem jednostavnog i preglednog upravljanja osobnim financijama. Mladi ljudi se vrlo često prvi put susreću s odgovornošću upravljanja novcem upravo tijekom srednje škole ili fakulteta. U tom razdoblju dobivaju džeparac, stipendiju ili zarađuju putem studentskih poslova, ali nemaju razvijene navike praćenja potrošnje. Zbog toga često dolazi do situacije u kojoj korisnik ne zna gdje je novac potrošen, a krajem mjeseca ostaje bez sredstava.
 
Problem koji ova aplikacija rješava jest nedostatak jednostavnog i prilagođenog alata za financijsko planiranje namijenjenog mladima. Iako postoje profesionalne aplikacije, kao na primjer YNAB, one su često preopširne, namijenjene odraslim korisnicima te uključuju napredne funkcionalnosti poput povezivanja s bankovnim računima. Takve mogućnosti nisu potrebne učenicima koji tek razvijaju osnovne financijske navike. Zbog toga je ideja ovog projekta razviti jednostavniju i pregledniju verziju aplikacije za upravljanje budžetom, prilagođenu školskom okruženju.
 
Aplikacija omogućuje korisniku unos prihoda i troškova, njihovu kategorizaciju te automatski izračun preostalog mjesečnog budžeta. Korisnik na početku definira svoj mjesečni budžet, nakon čega aplikacija prati sve unesene transakcije i u stvarnom vremenu prikazuje trenutno stanje. Time se korisniku pruža jasan uvid u financijsku situaciju bez potrebe za ručnim izračunima.
 
Osim osnovnog praćenja potrošnje, aplikacija omogućuje postavljanje financijskog cilja, primjerice štednje za određeni proizvod ili događaj. Sustav prikazuje napredak prema tom cilju, čime se potiče odgovorno upravljanje novcem i planiranje unaprijed. Dodatno, vizualni prikaz potrošnje po kategorijama omogućuje korisniku da uoči gdje troši najviše novca, što može pomoći u donošenju boljih financijskih odluka.
 
Ciljana skupina aplikacije su srednjoškolci i studenti koji žele imati jednostavan pregled svojih financija bez složenih bankovnih integracija. Aplikacija je osmišljena tako da bude intuitivna i laka za korištenje, s naglaskom na jasnoću prikaza podataka i responzivni dizajn koji omogućuje korištenje na mobilnim uređajima i stolnim računalima.
 
Odabir ove tematike temelji se na stvarnoj potrebi mladih za razvojem financijske pismenosti. Financijska pismenost sve je važnija vještina u suvremenom društvu, a njezino razvijanje treba započeti što ranije. BudgetBuddy predstavlja praktično rješenje koje korisnicima pomaže razumjeti vlastite financijske navike i potiče ih na odgovornije upravljanje novcem. Projekt time dobiva i širu društvenu vrijednost jer doprinosi razvoju svijesti o važnosti planiranja i kontrole osobnih financija.

Dodatna vrijednost aplikacije BudgetBuddy ogleda se i u razvoju samodiscipline kod korisnika. Redovitim unosom prihoda i troškova korisnik stvara naviku praćenja vlastitih financija, što dugoročno može imati pozitivan utjecaj na njegovo ponašanje prema novcu. Umjesto impulzivnog trošenja, korisnik postaje svjesniji svojih odluka te počinje razmišljati unaprijed. Također, aplikacija može poslužiti kao osobni alat za analizu potrošnje na kraju mjeseca, kada korisnik može procijeniti je li se pridržavao planiranog budžeta i na kojim područjima postoji prostor za poboljšanje. Na taj način BudgetBuddy postaje više od obične evidencije troškova – postaje sredstvo za razvoj odgovornijeg i organiziranijeg pristupa osobnim financijama.

Ovaj projekt omogućuje primjenu znanja iz područja web programiranja, rada s bazama podataka i autentifikacije korisnika. Također, uključuje implementaciju sigurnosnih pravila kako bi svaki korisnik imao pristup isključivo vlastitim podacima. BudgetBuddy nije samo tehnički zadatak, već i praktično rješenje stvarnog problema, čime projekt dobiva dodatnu vrijednost.



---
# Planirane funkcionalnosti

## Osnovne funkcionalnosti

| Funkcionalnost                 | Opis                                    |
| ------------------------------ | --------------------------------------- |
| Registracija korisnika         | Kreiranje računa putem emaila i lozinke |
| Prijava i odjava               | Autentifikacija pomoću Firebasea        |
| Oporavak lozinke               | Reset putem emaila                      |
| Korisnički profil              | Pregled i uređivanje osnovnih podataka  |
| Postavljanje mjesečnog budžeta | Definiranje limita potrošnje            |
| Dodavanje prihoda              | Unos iznosa i opisa                     |
| Dodavanje troška               | Unos iznosa i kategorije                |
| Brisanje transakcije           | Uklanjanje unosa                        |
| Automatski izračun preostalog novca       | Prikaz preostalog budžeta               |
| Responzivni dizajn             | Prilagodba mobilnim i desktop uređajima |
| Hosting aplikacije             | Objavljivanje putem Firebase Hostinga   |

---

## Napredne funkcionalnosti

| Funkcionalnost          | Opis                                       |
| ----------------------- | ------------------------------------------ |
| Graf potrošnje          | Vizualni prikaz troškova po kategorijama   |
| Progress bar budžeta    | Prikaz postotka iskorištenosti             |
| Financijski cilj        | Praćenje štednje prema cilju               |
| Upozorenje prekoračenja | Vizualni signal ako je budžet premašen     |
| Tamni način rada        | Mogućnost promjene teme                    |
| Admin uloga             | Pregled korisnika (administratorski račun) |

---

# Scenarij korištenja

1. **Registracija**
   Korisnik otvara aplikaciju i kreira račun unosom email adrese i lozinke.

2. **Prijava**
   Nakon uspješne registracije, korisnik se prijavljuje u sustav.

3. **Postavljanje budžeta**
   Na prvom ulasku korisnik definira mjesečni budžet (npr. 300 €).

4. **Dodavanje transakcije**
   Korisnik dodaje prihod ili trošak unosom:

   * iznosa
   * opisa
   * kategorije

5. **Automatski izračun**
   Sustav automatski ažurira:

   * ukupne prihode
   * ukupne troškove
   * preostali budžet
   * postotak iskorištenosti

6. **Praćenje napretka**
   Korisnik putem grafa i progress bara prati svoju potrošnju

7. **Ostvarenje cilja štednje**
   Ako korisnik postavi cilj (npr. 500 €), aplikacija prikazuje napredak prema tom cilju
---

# Vizualni prikaz
https://www.figma.com/make/ETnxrEy56V6epLDbYIFZdS/BudgetBuddy?fullscreen=1&t=iMEmNeZGbjozFQmK-1 