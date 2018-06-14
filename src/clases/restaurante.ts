export class Restaurante {
  constructor(public nombre: string, 
              public imagenes: string[],
              public rating: number,
              public ubicacion: {lat:number, lng:number}) {

  }
}