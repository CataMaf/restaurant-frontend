# Progres aplicație restaurant

## Funcționalități implementate astăzi:

### **1. Structura aplicației**
- Am creat o aplicație React cu două rute principale:
  - `/` - Dashboard pentru vizualizarea comenzilor.
  - `/masa/:id_masa` - Pagină dinamică pentru afișarea meniului specific mesei.

### **2. Funcționalități pentru pagină de meniu**
- Afișarea meniului cu categorii și articole dintr-un fișier JSON (`menuData.json`).
- Stilizare modernă pentru articole și coș, inclusiv umbre.
- Funcționalitate de adăugare a articolelor în coș.
- Calcularea totalului articolelor din coș.
- Funcționalitatea de ștergere a articolelor din coș.
- Buton "Trimite Comanda" care trimite comanda prin WebSocket.
- Ascunderea butonului "Trimite Comanda" după trimiterea comenzii.
- Afișarea unui mesaj de confirmare temporar după trimiterea comenzii.

### **3. Funcționalități pentru Dashboard**
- Afișarea comenzilor primite de la mese în timp real.
- Integrarea cu WebSocket pentru a recepționa comenzile de la server.

### **4. Configurare WebSocket**
- Am creat un server WebSocket utilizând `socket.io` pentru:
  - Gestionarea conexiunilor clienților.
  - Trimiterea comenzilor de la clienți la dashboard.
  - Stocarea temporară a comenzilor în memoria serverului.
- Integrarea WebSocket în aplicația React:
  - Conexiunea inițializată direct în componentele React (TableMenu și Dashboard).
  - Efect de curățare (deconectare) la demontarea componentelor pentru a evita conexiuni multiple.

### **5. Testare pe dispozitive multiple**
- Configurarea aplicației pentru acces local prin IP-ul calculatorului.
- Testarea accesării meniului de pe telefon și a dashboard-ului de pe desktop:
  - Trimiterea comenzilor de pe telefon.
  - Vizualizarea comenzilor în timp real pe dashboard.

### **6. Rezolvare probleme identificate**
- Eroarea de stilizare și pierderea umbrei au fost corectate.
- Inițializarea corectă a WebSocket direct în componente.
- Efectul de curățare pentru deconectarea WebSocket-ului a fost implementat corect.

Rezumat al sesiunii de astăzi

Ce am realizat:

Corectarea și stabilizarea funcționalităților aplicației:

Am rezolvat problema lipsei actualizării stării produselor și meselor din dashboard:

Produsele sunt acum marcate corect ca viewed: true după confirmarea vizualizării.

Câmpul hasNewChanges este resetat la false după confirmare.

Am implementat gestionarea evenimentelor WebSocket pentru:

Confirmarea vizualizării comenzilor.

Resetarea meselor.

Debugging complet și monitorizare:

Am adăugat loguri atât pe server (index.js), cât și pe client (Dashboard.js și socket.js) pentru a verifica fluxul complet al datelor și evenimentelor.

Am confirmat că datele sunt transmise corect între server și client.

Funcționalități confirmate:

Trimiterea comenzilor noi: Funcționează corect și actualizează starea comenzilor pe server și în dashboard.

Confirmarea vizualizării comenzilor: Marchează produsele ca vizualizate și dezactivează evidențierea pentru masa respectivă.

Resetarea unei mese: Șterge complet comenzile unei mese și actualizează starea în timp real pe client.

Afișarea mesajelor în dashboard: Conexiunea WebSocket funcționează stabil, iar logurile din dashboard și server confirmă acest lucru.

Stabilizarea funcționalității dashboard-ului:

Produsele noi sunt evidențiate corect.

Butonul „Confirmă Vizualizarea Modificărilor” apare doar pentru mesele care au modificări.

Resetarea unei mese funcționează fără probleme.

## Ce urmează să implementăm:

- mutarea cosului la o ruta noua "/masa/{id_masa}/cos" pentru a putea fi accesat mai usor
- crearea in pagina de meniu a unui buton de accesare a cosului daca sunt produse in cos
- implementarea functionalitatii de a comanda iar dupa trimiterea comenzii, iar in dashboard sa nu se creeze din nou masa daca nu a fost inchisa ci sa se actualizeze cu noile produse comandate evidentiate astfel incat persoana de la bar sa-si dea seama ca sunt produse noi adaugate
- datele despre comenzile fiecarei mese trebuie sa fie persistente pana la efectuarea platii
- crearea pentru client a ununi buton "Solicita nota de plata" la pasarea caruia se va trimite mesaj catre dashboard si totodata i se va afisa nota de plata care va contine produsele comandate, pretul per produs si totalul
- crearea in dashboard a unui buton "Plata efectuata" care va sterge masa respectiva de pe dashboard si toate celelalte informatii (resetarea mesei pentru a putea fi utilizata de alti clienti)
- Securizarea conexiunilor utilizând HTTPS și WSS.
- Adăugarea autentificării pentru dashboard (pentru acces restricționat).
- Îmbunătățiri vizuale suplimentare pentru meniuri și coș.
- Optimizarea aplicației pentru performanță pe dispozitive multiple.




## Notă finală:
Toate modificările sunt salvate într-un repository Git privat - https://github.com/CataMaf/chatbot-restaurant, iar progresul este sincronizat. 
Exista de asemenea creat si un server pentru a putea testa aplicatia aici: https://github.com/CataMaf/server
