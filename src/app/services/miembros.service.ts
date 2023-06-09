import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, collectionData, doc, deleteDoc, getDocs, getDoc} from '@angular/fire/firestore'
import Miembro from '../interfaces/miembro.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MiembrosService {

  constructor(private firestore: Firestore) { }

  addMiembro(miembro: Miembro){
    const miembroRef = collection(this.firestore,'miembros');
    return addDoc(miembroRef, miembro);
  }

  addAsistencia(asistencia: any){
    const miembroRef = collection(this.firestore,'asistencia');
    return addDoc(miembroRef, asistencia);
  }

  getMiembros(): Observable<Miembro[]>{
    const miembroRef = collection(this.firestore, 'miembros');
    return collectionData(miembroRef, {idField: 'id'}) as Observable<Miembro[]>
  }

  getMiembrosNombres(){
    const nombres = [];
    const miembroRef = collection(this.firestore, 'miembros');
    const lista = collectionData(miembroRef, {idField: 'id'}) as Observable<Miembro[]>
  }

  deleteMiembros(miembro: Miembro){
    const miembroDocRef = doc(this.firestore, `miembros/${miembro.id}`);
    return deleteDoc(miembroDocRef);
  }

}
