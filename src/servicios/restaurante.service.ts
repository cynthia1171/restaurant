import { Injectable } from "@angular/core";
import { Restaurante } from '../clases/restaurante';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { ToastController } from "ionic-angular/umd";

declare var cordova;

@Injectable()
export class RestauranteService {
  restaurantes: Restaurante[] = [];

  constructor(public storage: Storage,
              private file: File,
              public toastCtrl: ToastController) {

  }

  agregarRestaurante(nombre:string, imagenes:string[], rating:number, ubicacion:{lat:number, lng:number}) {
    let restaurante = new Restaurante(nombre, imagenes, rating, ubicacion);

    this.restaurantes.push(restaurante);

    //guardamos la lista de restaurantes
    this.storage.set('restaurantes', this.restaurantes);
  }

  cargarRestaurantes() {
    return this.restaurantes.slice();
  }

  inicializarRestaurantes() {
    return this.storage.get('restaurantes')
                       .then((restaurantes: Restaurante[]) => {
                         if(restaurantes == null) {
                           this.restaurantes = [];
                         } else {
                           this.restaurantes = restaurantes;
                         }
                         return this.restaurantes.slice();
                       }) 
                       .catch(error => {console.log(error);})
  }

  borrarRestaurante(rid: number) {
    let restaurante = this.restaurantes[rid];
    this.restaurantes.splice(rid, 1);
    this.storage.set('restaurantes', this.restaurantes)
                .then(() => {
                  this.borrarImagenes(restaurante);
                })
                .catch()
  }

  borrarImagenes(restaurante:Restaurante) {
    restaurante.imagenes.forEach((imagen) => {
      let nombre = imagen.substr(imagen.lastIndexOf('/') + 1);
      this.file.removeFile(cordova.file.dataDirectory, nombre)
                .then()
                .catch(error => {
                  let toast = this.toastCtrl.create({
                    message: 'Ocurrió un error. File.removeFile',
                    duration: 3000
                  })
                  toast.present();
                  this.agregarRestaurante(restaurante.nombre, restaurante.imagenes, restaurante.rating, restaurante.ubicacion);
                }
    })
  }
}