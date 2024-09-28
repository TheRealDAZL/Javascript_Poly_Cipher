class Message {
    constructor(id, message, cleSubstitution = "", cleTransposition = "", sensDuChiffrement,
                librairie = "", resultat = "") {
        this.id = id
        this.message = message
        this.cleSubstitution = cleSubstitution
        this.cleTransposition = cleTransposition
        this.sensDuChiffrement = sensDuChiffrement
        this.librairie = librairie
        this.resultat = resultat
        this.image = "img/des.jpg"
    }

    // Méthode qui valide la librairie et l'enregistre dans l'objet
    validerLibrairie() {
        if (this.librairie.length === 1) {
            this.erreurChiffrement(`Votre librairie doit contenir plus d'un caractère.`)
        }

        else if (this.librairie === "") {
            this.librairie = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ."
        }

        for (let i = 0; i < this.librairie.length - 1; i++) {
            if (this.librairie.substring(i + 1).includes(this.librairie[i])) {
                this.erreurChiffrement(`Votre librairie ne doit pas contenir plus d'une fois le même caractère.`)
            }
        }
    }

    // Méthode qui valide le message et l'enregistre dans l'objet. Si le message est trop court, on ajoute des caractères
    // à la fin du string, de façon à ce que le message fasse la même longueur que la librairie de caractères
    validerMessage() {
        // Si le message est vide ou trop long, afficher un message d'erreur, puis lancer une erreur
        if (this.message.length < 1 || this.message.length > this.librairie.length) {
            this.erreurChiffrement(`Votre message doit faire de 1 à ${this.librairie.length} caractères de long.`)
        }

        // Si le message ne fait pas la même longueur que la librairie, ajouter des caractères à la fin du string, afin que le string fasse
        // exactement la même longueur
        for (let i = this.message.length; i < this.librairie.length; i++) {
            let index = this.randomiser(this.librairie.length)
            this.message = this.message + this.librairie[index].toString()
        }
    }

    // Méthode qui valide la clé et retourne la clé validée. Si la clé est trop courte, on ajoute des caractères
    // à la fin du string, de façon à ce que la clé fasse la même longueur que la librairie
    validerCle(cle) {
        // Si la clé n'est pas vide et qu'elle possède moins ou autant de caractères que la librairie
        if (cle !== "" && cle.length <= this.librairie.length) {
            // Pour chaque caractère de la clé, valider que le caractère fait partie de la librairie
            for (let i = 0; i < cle.length; i++) {
                // Si un des caractères de la clé n'est pas valide, afficher un message d'erreur
                if (!this.librairie.includes(cle[i])) {
                    this.erreurChiffrement(`Votre clé contient des caractères invalides. Les caractères valides sont :<br>${this.librairie.toString()}`)
                }
            }
        }

        // Si la clé est trop longue, afficher un message d'erreur, puis lancer une erreur
        else if (cle.length > this.librairie.length) {
            this.erreurChiffrement(`Votre clé contient plus de ${this.librairie.length} caractères.`)
        }

        // Si la clé est de la même longueur que la librairie, retourner la clé comme telle
        if (cle.length === this.librairie.length) {
            return cle
        }

        // Si la clé est vide, générer des caractères afin que le string fasse exactement la même longueur que la librairie
        else if (cle.length === 0) {
            for (let i = 0; i < this.librairie.length; i++) {
                let index = this.randomiser(this.librairie.length)
                cle = cle.toString() + this.librairie[index].toString()
            }

            return cle
        }

        let longueurCle = cle.length

        // Si la clé est moins longue que la librairie, répéter les caractères de la clés jusqu'à ce que la clé soit de la même longueur que la librairie
        for (let i = longueurCle; i < this.librairie.length; i++) {
            cle = cle.toString() + cle[i % longueurCle].toString()
        }

        return cle
    }

    // Méthode qui substitue les caractères du message, en utilisant la clé de substitution, le sens du chiffrement et la librairie
    substituerLesCaracteres(message, sens) {
        let extrant = ""

        for (let i = 0; i < message.length; i++)
        {
            // Pour chaque caractère du message et de la clé de substitution, trouver l'index des caractères dans la librairie
            let indexCaractere1 = this.librairie.indexOf(message[i].toString())
            let indexCaractere2 = this.librairie.indexOf(this.cleSubstitution[i].toString())

            // Si le caractère est présent dans la librairie, appliquer les instructions suivantes
            if (indexCaractere1 !== -1)
            {
                let deplacement = sens ? indexCaractere2 : -indexCaractere2 + this.librairie.length
                let indexCaractereFinal = (indexCaractere1 + deplacement) % this.librairie.length

                extrant += this.librairie[indexCaractereFinal].toString()
            }

            // Si le caractère n'y est pas, afficher un message d'erreur, et lancer une erreur
            else
            {
                this.erreurChiffrement(`Votre message contient des caractères invalides. Les caractères valides sont :<br>${this.librairie.toString()}`)
            }
        }

        this.resultat = extrant.toString()
    }

    // Méthode qui transpose les caractères du message, en utilisant la clé de transposition, le sens du chiffrement et la librairie
    transposerLesCaracteres(message, sens) {
        // Référence : MDN Web Docs - Array.from()
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        let extrant = Array.from(message.toString())
        let indexPosition1;
        sens ? indexPosition1 = 0 : indexPosition1 = extrant.length - 1
        let incrementation;

        for (sens ? incrementation = 1 : incrementation = -1; indexPosition1 !== extrant.length && indexPosition1 !== -1; indexPosition1 += incrementation) {
            let indexPosition2 = this.librairie.indexOf(this.cleTransposition[indexPosition1].toString())

            let indexPositionFinale = (indexPosition1 + indexPosition2) % this.librairie.length

            let valeurTemp = extrant[indexPositionFinale]
            extrant[indexPositionFinale] = extrant[indexPosition1]
            extrant[indexPosition1] = valeurTemp
        }

        // Référence : MDN Web Docs - Array.prototype.join()
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
        this.resultat = extrant.join("")
    }

    // Méthode pour créer des nombres aléatoires sur mesure
    randomiser(borneSup) {
        return Math.floor(Math.random() * borneSup)
    }

    // Méthode pour gérer les erreurs lors du chiffrement
    erreurChiffrement(message) {
        document.getElementById("messageUtilisateur").classList.remove("couleurTexte")
        document.getElementById("messageUtilisateur").classList.add("erreur")
        document.getElementById("messageUtilisateur").innerHTML = message
        document.getElementById("messageUtilisateur").focus()
        throw new Error()
    }
}

class Liste {
    constructor(messages = []) {
        this.messages = messages
        this.exemples = [
            {
                "id": 0,
                "message": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleSubstitution" : "0000000000000000000000000000000000000000000000000000000000000000",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : true,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "12x6haze9iBmjqDu5yFClGHKbOJSnWL 34NcpkPsdARIrQTY78VotEXUfgZMvw.0",
                "image" : "img/des.jpg"
            },

            {
                "id": 1,
                "message": "12x6haze9iBmjqDu5yFClGHKbOJSnWL 34NcpkPsdARIrQTY78VotEXUfgZMvw.0",
                "cleSubstitution" : "0000000000000000000000000000000000000000000000000000000000000000",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : false,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "image" : "img/des.jpg"
            },

            {
                "id": 2,
                "message": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0000000000000000000000000000000000000000000000000000000000000000",
                "sensDuChiffrement" : true,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "02468acegikmoqsuwyACEGIKMOQSUWY 02468acegikmoqsuwyACEGIKMOQSUWY ",
                "image" : "img/des.jpg"
            },

            {
                "id": 3,
                "message": "02468acegikmoqsuwyACEGIKMOQSUWY 02468acegikmoqsuwyACEGIKMOQSUWY ",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0000000000000000000000000000000000000000000000000000000000000000",
                "sensDuChiffrement" : false,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "image" : "img/des.jpg"
            },

            {
                "id": 4,
                "message": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : true,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "242cyk6siAaICQeYa4icGkmsmAqIKQuY68yoOECUq8GoSEKUegOMWgSMuwWw 0 0",
                "image" : "img/des.jpg"
            },

            {
                "id": 5,
                "message": "242cyk6siAaICQeYa4icGkmsmAqIKQuY68yoOECUq8GoSEKUegOMWgSMuwWw 0 0",
                "cleSubstitution" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "cleTransposition" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "sensDuChiffrement" : false,
                "librairie" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "resultat" : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .",
                "image" : "img/des.jpg"
            }
        ]
    }

    // Méthode qui effectue le traitement général de l'objet, et qui l'ajoute ensuite à la liste d'es 'objets
    // Cette méthode prend comme arguments :
    // - le message;
    // - deux clés (facultatives);
    // - un sens de chiffrement.
    traiterObjet(objetMessage) {
        objetMessage.validerLibrairie()
        objetMessage.validerMessage()
        objetMessage.cleSubstitution = objetMessage.validerCle(objetMessage.cleSubstitution)
        objetMessage.cleTransposition = objetMessage.validerCle(objetMessage.cleTransposition)

        if (objetMessage.sensDuChiffrement) {
            objetMessage.substituerLesCaracteres(objetMessage.message, objetMessage.sensDuChiffrement)
            objetMessage.transposerLesCaracteres(objetMessage.resultat, objetMessage.sensDuChiffrement)
        }

        else {
            objetMessage.transposerLesCaracteres(objetMessage.message, objetMessage.sensDuChiffrement)
            objetMessage.substituerLesCaracteres(objetMessage.resultat, objetMessage.sensDuChiffrement)
        }

        document.getElementById("librairie").value = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ."
        document.getElementById("messageIntrant").value = ""
        document.getElementById("cleIntrantSub").value = ""
        document.getElementById("cleIntrantTra").value = ""
        document.getElementById("encoder").checked = true
        sensDuChiffrement = true
        document.getElementById("messageExtrant").value = objetMessage.resultat

        this.ajouterMessage(objetMessage)
    }

    // Méthode qui ajoute l'argument message à la liste d'objets
    ajouterMessage(message) {
        this.messages.push(message)
        this.enregistrerListe()
        this.toString()

        document.getElementById("supprimerTout").disabled = false
    }

    // Méthode qui supprime un message de la liste d'objets, basé sur l'id passé en paramètre. L'argument supprimer
    // sert içi à identifier si on modifie un objet, ou si on supprime un objet.
    supprimerMessage(id, supprimer = false) {
        if (!supprimer) {
            supprimer = (window.confirm("Voulez-vous vraiment supprimer cet objet?"))
        }

        if (supprimer) {
            // Référence : MDN Web Docs - Array.prototype.splice()
            // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            this.messages.splice(id, 1)

            if (this.messages.length !== 0) {
                let copieTableau = this.messages

                this.supprimerTousLesMessages()

                // Si ce n'est pas égal à 0, ça ne fonctionnera pas comme il le faut
                for (let index = 0; index < copieTableau.length; index++) {
                    let objetMessage = new Message(index, copieTableau[index].message, copieTableau[index].cleSubstitution,
                        copieTableau[index].cleTransposition, copieTableau[index].sensDuChiffrement, copieTableau[index].librairie, copieTableau[index].resultat)
                    this.ajouterMessage(objetMessage)
                }
            }

            else {
                this.supprimerTousLesMessages()
            }
        }
    }

    // Méthode qui supprime tous les objets
    supprimerTousLesMessages() {
        this.messages = []
        localStorage.clear()

        document.getElementById("supprimerTout").disabled = true
        document.getElementById("card-container").innerHTML = ""
    }

    // Méthode qui modifie un objet, basé sur l'id passé en paramètre
    modifierMessage(id) {
        document.getElementById("librairie").value = this.messages[id].librairie.toString()
        document.getElementById("messageIntrant").value = this.messages[id].message.toString()
        document.getElementById("cleIntrantSub").value = this.messages[id].cleSubstitution.toString()
        document.getElementById("cleIntrantTra").value = this.messages[id].cleTransposition.toString()
        document.getElementById("messageExtrant").value = this.messages[id].resultat.toString()

        // MDN Web Docs - Conditional (ternary) operator
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        this.messages[id].sensDuChiffrement === true ?
            document.getElementById("encoder").checked = true :
            document.getElementById("decoder").checked = true

        document.getElementById("messageIntrant").focus()

        modifsObjet = true

        // MDN Web Docs - Conditional (ternary) operator
        // Lien : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        document.getElementById("encoder").checked ? sensDuChiffrement = true : sensDuChiffrement = false

        this.supprimerMessage(id, true)
        this.toString()
    }

    // Méthode qui charge les messages enregistrés
    allerChercherListe() {
        let messages = JSON.parse(localStorage.getItem("messages"))

        if (messages === null) {
            messages = this.exemples
        }

        for (let i = 0; i < messages.length; i++) {
            let objetMessage = new Message(messages[i].id, messages[i].message.toString(), messages[i].cleSubstitution,
                messages[i].cleTransposition, messages[i].sensDuChiffrement, messages[i].librairie, messages[i].resultat)
            this.traiterObjet(objetMessage)
        }
    }

    // Méthode qui enregistre les messages
    enregistrerListe() {
        localStorage.setItem("messages", JSON.stringify(this.messages))
    }

    // Méthode qui sert à afficher les objets sous la forme de cartes Bootstrap
    toString() {
        document.getElementById("card-container").innerHTML = ""

        let cartes = ""

        for (let index = 0; index < this.messages.length; index++) {
            let sens

            this.messages[index].sensDuChiffrement ? sens = "Encoder" : sens = "Décoder"

            cartes += `<div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <div class="card h-100 p-2">
                            <div class="card-body">
                                <p class="card-title couleurTexte font-size-pTexte">Objet no. ${this.messages[index].id + 1}</p>
                                <img src="${this.messages[index].image}" class="img-fluid" alt="Image de l'objet">
                                <p><span class="couleurTexte font-size-pCartes">Message initial :</span><br><span class="couleurObjet font-size-pCartes">${this.messages[index].message.toString()}</span><br>
                                   <span class="couleurTexte font-size-pCartes">Message final :</span><br><span class="couleurObjet font-size-pCartes">${this.messages[index].resultat.toString()}</span></p>
                                <p class="card-infos invisible"><span class="couleurTexte font-size-pCartes">Clé de substitution :</span><br><span class="couleurObjet font-size-pCartes">${this.messages[index].cleSubstitution.toString()}</span><br>
                                                     <span class="couleurTexte font-size-pCartes">Clé de transposition :</span><br><span class="couleurObjet font-size-pCartes">${this.messages[index].cleTransposition.toString()}</span><br>
                                                     <span class="couleurTexte font-size-pCartes">Librairie de caractères :</span><br><span class="couleurObjet font-size-pCartes">${this.messages[index].librairie.toString()}</span><br>
                                                     <span class="couleurTexte font-size-pCartes">Sens du chiffrement :</span><br><span class="couleurObjet font-size-pCartes">${sens}</span></p>
                            </div>
                            <button class="btn btn-primary col-9 mx-auto mb-2 font-size-pCartes" onclick="listeDeMessages.modifierMessage(${index})" type="button">Modifier cet objet</button>
                            <button class="btn btn-danger col-9 mx-auto mb-2 font-size-pCartes" onclick="listeDeMessages.supprimerMessage(${index})" type="button">Supprimer cet objet</button>
                        </div>
                      </div>`
        }

        document.getElementById("card-container").innerHTML = cartes
    }
}
