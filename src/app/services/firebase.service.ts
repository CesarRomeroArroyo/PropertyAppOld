import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAuthentication, Usermodel } from '../models/usuarios.model';


@Injectable({
	providedIn: 'root'
})
export class FirebaseService {

	items: Observable<any[]>;
	private itemsCollection: AngularFirestoreCollection<any>;
	constructor(private db: AngularFirestore,
		private afAuth: AngularFireAuth
	) { }

	obtener(tabla, show?): Observable<any> {
		this.itemsCollection = this.db.collection(tabla);
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}

	async obtenerPromise(tabla, show?) {
		let returnData = [];
		var data = await this.db.collection(tabla).get().toPromise();
		data.forEach(info => {
			var d = info.data();
			d["id"] = info.id;
			returnData.push(d);
		});
		return returnData;
	}

	obtenerId(tabla, id, show?): Observable<any> {
		this.itemsCollection = this.db.collection(tabla, ref => ref.where('id', '==', id));
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}

	async obtenerIdPromise(tabla, id, show?) {
		let returnData = [];
		var data = await this.db.collection(tabla, ref => ref.where('id', '==', id)).get().toPromise();
		data.forEach(info => {
			var d = info.data();
			d["id"] = info.id;
			returnData.push(d);
		});
		return returnData;
	}


	async obtenerXFechaPromise(tabla, id, show?) {
		let returnData = [];
		var data = await this.db.collection(tabla, ref => ref.where('fecha', '==', id)).get().toPromise();
		data.forEach(info => {
			var d = info.data();
			d["id"] = info.id;
			returnData.push(d);
		});
		return returnData;
	}

	obtenerUniqueId(tabla, id): Observable<any> {
		this.itemsCollection = this.db.collection(tabla, ref => ref.where('idunico', '==', id));
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}


	async obtenerUniqueIdPromise(tabla, id) {
		let returnData = [];
		var data = await this.db.collection(tabla, ref => ref.where('idunico', '==', id)).get().toPromise();
		data.forEach(info => {
			var d = info.data();
			d["id"] = info.id;
			returnData.push(d);
		});
		return returnData;
	}

	obtenerLogin(user, pass): Observable<any> {
		this.itemsCollection = this.db.collection('usuarios', ref => ref.where('usuario', '==', user).where('password', '==', pass));
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}


	async obtenerLoginPromise(userAuth: UserAuthentication) {

		let returnData = [];
		var data = await this.db.collection('usuarios', ref => ref.where('email', '==', userAuth.user)).get().toPromise();

		data.forEach(info => {
			var d = info.data();
			d["id"] = info.id;
			returnData.push(d);
		});

		return returnData;
	}


	obtenerChat(id) {
		this.itemsCollection = this.db.collection('chat', ref => ref.where('uniqueId', '==', id));
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}

	obtenerChatReceptor(idReceptor) {
		this.itemsCollection = this.db.collection('chat', ref => ref.where('receptor', '==', idReceptor));
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}

	obtenerChatEmisor(idEmisor) {
		this.itemsCollection = this.db.collection('chat', ref => ref.where('emisor', '==', idEmisor));
		return this.itemsCollection.snapshotChanges().pipe(
			map(data => {
				return data.map(d => {
					const retorno = d.payload.doc.data();
					retorno['id'] = d.payload.doc.id;
					return retorno;
				});
			})
		);
	}

	guardarDatos(tabla: string, data) {
		this.itemsCollection = this.db.collection<any>(tabla);
		return this.itemsCollection.add(JSON.parse(JSON.stringify(data))).then(
			(resp) => {
				return resp.id;
			}
		).catch(() => {
			return false;
		});
	}

	actualizarDatos(tabla, data, id) {
		this.itemsCollection = this.db.collection<any>(tabla);
		return this.itemsCollection.doc(id).update(JSON.parse(JSON.stringify(data))).then(
			() => {
				return true;
			}
		).catch(() => {
			return false;
		});
	}

	eliminarDatos(tabla: string, id: any) {
		this.itemsCollection = this.db.collection<any>(tabla);
		this.itemsCollection.doc(id).delete().then(
			() => {
				return true;
			}
		).catch(() => {
			return false;
		});
	}

	async login(email: string, password: string): Promise<any> {
		try {
			const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);

			console.log(user);
			///this.updateUserData(user);

			return user;
		} catch (error) {
			console.log('Error->', error);
		}
	}
	async registerUser(userAuth: Usermodel): Promise<any> {
		try {
			const { user } = await this.afAuth.createUserWithEmailAndPassword(userAuth.email, userAuth.password);
			await this.sendVerifcationEmail();
			return user;
		} catch (error) {
			console.log('Error->', error);

			return error;
		}
	}

	async sendVerifcationEmail(): Promise<void> {
		try {
			return (await this.afAuth.currentUser).sendEmailVerification();
		} catch (error) {
			console.log('Error->', error);
		}
	}

	async resetPassword(email: string) {
		try {
			return await this.afAuth.sendPasswordResetEmail(email);
		} catch (error) {
			console.log(error);
		}
	}
	 updateUserData(user:Usermodel) {
	
	  } 



}