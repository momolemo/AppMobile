// Attendre que PhoneGap soit prêt
			//
			document.addEventListener("deviceready", onDeviceReady, false);
			// PhoneGap est prêt
			//
			function onDeviceReady() {
				idPret = 0;
				idPretSuppr = 0;
			
				getContacts();
				var db = window.openDatabase("pretBDD", "1.0", "pretBDD", 200000);
				db.transaction(populateDB, errorCB, successCB);
				
				$('#pret').live('swiperight',function(event){
					$.mobile.changePage( $("#Accueil"));
				});
			}
			
			//create table and insert some record
			function populateDB(tx) {
				//tx.executeSql('DROP TABLE IF EXISTS Pret');
				tx.executeSql('CREATE TABLE IF NOT EXISTS Pret (id_pret INTEGER PRIMARY KEY AUTOINCREMENT, Titre TEXT NOT NULL, Description TEXT NOT NULL, Date TEXT NOT NULL, Nom TEXT, Prenom TEXT, Type TEXT NOT NULL)');
			}
			
			//function will be called when an error occurred
			function errorCB(err) {
				console.log("Error processing SQL: "+err.code);
			}

			//function will be called when process succeed
			function successCB() {
				console.log("success!");
			}
			
			
			/* get all contacts from device */
			function getContacts(){
				  var optFilter = new ContactFindOptions();
				  optFilter.filter = "";        // to return all contacts
				  optFilter.multiple = true;    // return multiple results
				  fields = ["name", "id"];
				   
				  // get all contacts
				  navigator.contacts.find(fields, gcsSuccess, gcsError, optFilter);
}
			
			/* get all contacts error */
			function gcsError(contactError){
				  console.log('Contacts Error');
			}
			
			function gcsSuccess(contacts){
			if( contacts.length != 0 ){
				// get formatted names and sort
				var names = new Array();
				for(var i=0; i<contacts.length; ++i){
					  if(contacts[i].name){
							if(contacts[i].name.formatted) names.push(contacts[i].name.formatted);
					  }
				}
				names.sort();
			
				var list = $('.list');
				list.html(''); // remove all the list items
				for(var i=0; i<names.length; ++i){
					list.append('<li class="elemliste">'+names[i]+'</li>');
				}
				
				 
				list.listview('refresh'); // refresh the list view
			} else $('.list').html('No contacts');
			}
			
			function ajoutPret()
			{
				if (($("select.malist").val()=="autre" && $("input.textautre").val()=='') ||
					$("#titlePret").val()=='' ||
					$("#description").val()=='' )
				{
					alert('Veuillez remplir les champs avant de créer un pret!');
				}
				else
				{
					var db = window.openDatabase("pretBDD", "1.0", "pretBDD", 200000);
					db.transaction(insertionPret, errorCB, successCB);
				}
			}
			
			function insertionPret(tx)
			{
				var date = new Date;
				var jours = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
				var mois = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');

				var annee = date.getFullYear();
				var moi = date.getMonth();
				var jour_num = date.getDate();
				var jour = date.getDay();

				var h = date.getHours();
				var m = date.getMinutes();
				var s = date.getSeconds();
				if(h<10){ h = "0"+h;}
				if(m<10){ m = "0"+m;}
				if(s<10){ s = "0"+s;}

				var Date_Heure = jours[jour]+' '+jour_num+' '+mois[moi]+' '+annee+', '+h+' h '+m+' mn '+s+' s.';
				
				if($("select.malist").val()=="autre")
				{
					tx.executeSql('INSERT INTO Pret (Titre, Description, Date, Nom, Prenom, Type) VALUES (?,?,?,?,?,?)',[$("#titlePret").val(), $("#description").val(), Date_Heure, $("#prenomContact").text(), $("#nomContact").text(), $("#autre").val()]);
				}
				else
				{
					tx.executeSql('INSERT INTO Pret (Titre, Description, Date, Nom, Prenom, Type) VALUES (?,?,?,?,?,?)',[$("#titlePret").val(), $("#description").val(), Date_Heure, $("#prenomContact").text(), $("#nomContact").text(), $("select.malist").val()]);
				}
				$("input.textautre").val('');
				$("#titlePret").val('');
				$("#nomContact").text('');
				$("#prenomContact").text('');
				$("#description").val('');
				$.mobile.changePage( $("#Accueil"));
			}
			
			function affichePret(_idPret)
			{
				idPret = _idPret;
			
				var db = window.openDatabase("pretBDD", "1.0", "pretBDD", 200000);
				db.transaction(affichagePret, errorCB, successCB);
				
			}
			
			function affichagePret(tx) {
				// SELECT * FROM Pret WHERE ID_pret=idPret
				tx.executeSql('SELECT * FROM Pret WHERE id_pret=?', [idPret], donneesPourAffichagePret,
					function() {
						console.log('Erreur SELECT * FROM Pret WHERE id_pret=idPret Pour Affichage Pret');
					}
				);
			}
			
			function donneesPourAffichagePret(tx, results) {
				// Affichage des valeurs
				$('#titrePret').text(results.rows.item(0).Titre);
				$('#typePret').text(results.rows.item(0).Type);
				$('#datePret').text(results.rows.item(0).Date);
				$('#nomPret').text(results.rows.item(0).Nom);
				$('#prenomPret').text(results.rows.item(0).Prenom);
				$('#descriptionPret').text(results.rows.item(0).Description);
				$('#suppressionPret').html('<a href="javascript: suppressionPret(' + results.rows.item(0).id_pret + ');" class="btnSuppr" data-role="button">Supprimer le Pret</a>');
				$('.btnSuppr').button();
				
				// Changement de page
				$.mobile.changePage( $("#pret"));
			}
					
			function suppressionPret(_idPretSuppr) {
				idPretSuppr = _idPretSuppr;
			
				var db = window.openDatabase("pretBDD", "1.0", "pretBDD", 200000);
				db.transaction(supprimePret, errorCB, successCB);
			}
			
			function supprimePret(tx) {
				tx.executeSql('DELETE FROM Pret WHERE id_pret=?', [idPretSuppr]);
				$.mobile.changePage( $("#Accueil"));
			}
			
			function remplirAccueil() {
				var db = window.openDatabase("pretBDD", "1.0", "pretBDD", 200000);
				db.transaction(remplissageAccueil, errorCB, successCB);
			}
			
			function remplissageAccueil(tx) {
				tx.executeSql('SELECT * FROM Pret ORDER BY Type', [], donneesPourAccueil,
					function() {
						console.log('Erreur select * from pret pour accueil');
					}
				);
			}
			
			function donneesPourAccueil(tx, results) {
				var i = 0;
				var categorie = "";
				
				if( results.rows.length != 0 ){
					var list = $('#listRemplirAccueil');
					list.html(''); // remove all the list items
					
					
					while(i < results.rows.length) {
						categorie = results.rows.item(i).Type;
						list.append("<li data-role=\"list-divider\">" + categorie + "</li>");
						while(i < results.rows.length && results.rows.item(i).Type == categorie)
						{
							list.append("<li><a href=\"javascript: affichePret(" + results.rows.item(i).id_pret + ");\">" + results.rows.item(i).Titre + "</a></li>");
							i++;
						}
					}
					
					list.listview('refresh'); // refresh the list view
				}
				else $('#listRemplirAccueil').html('Pas de pret en cours !!!');
			}
			
			function remplirChoixTypeAjout() {
				var db = window.openDatabase("pretBDD", "1.0", "pretBDD", 200000);
				db.transaction(remplissageChoixTypeAjout, errorCB, successCB);
			}
			
			function remplissageChoixTypeAjout(tx) {
				tx.executeSql('SELECT DISTINCT Type FROM Pret ORDER BY Type', [], donneesPourChoixTypeAjout,
					function() {
						console.log('Erreur select * from pret pour choixtypeajout');
					}
				);
			}
			
			function donneesPourChoixTypeAjout(tx, results) {
				var select = $('#choixTypeAjout');
				select.html(''); // remove all the select items
				
				for(var i = 0; i < results.rows.length; i++)
				{
					select.append("<option value=\"" + results.rows.item(i).Type + "\">" + results.rows.item(i).Type + "</option>");
				}
				
				select.append("<option value=\"autre\">Autre</option>");
				select[0].selectedIndex = i;
				select.selectmenu('refresh'); // refresh the select
				$("input.textautre").removeClass("ui-disabled");
			}	