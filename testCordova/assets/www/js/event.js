	// Activation ou desactivation de l'input de creation d'un nouveau type
				$(".malist").bind( "change", function(event, ui) {
					if($("select.malist").val()=="autre")
					{
						$("input.textautre").removeClass("ui-disabled");
						$("input.textautre").val('');
					}
					else
					{
						$("input.textautre").addClass("ui-disabled");
					}
				});
				
				//récupération du nom de contact choisi et découpage en nom et prenom
				$('.list li').live('click', function(event) {
					var chaine=$(this).clone().children().remove().end().text();
					var tab=chaine.split(" ");
					$('#nomContact').text(tab[1]);
					$('#prenomContact').text(tab[0]);
					$('#Choixcontact').dialog('close')
				});
				
				//appel de la fonction de remplissage de la page accueil avant son affichage
				$("#Accueil").live('pagebeforeshow', function() {
					remplirAccueil();
				});
				
				//appel de la fonction de remplissage du select avec les type présent dans la bdd
				$("#Ajout").live('pagebeforeshow', function() {
					remplirChoixTypeAjout();
				});
				