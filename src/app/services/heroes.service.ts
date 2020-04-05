import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class HeroesService {

  private url = "https://appheroes-887fd.firebaseio.com";
  
	constructor(private http: HttpClient) {}

	crearHeroe(heroe: HeroeModel) {
		return this.http.post(`${this.url}/heroes.json`, heroe).pipe(
			map( (resp: any) => {
				heroe.id = resp.name; // name es el id devuelto por firebase
				return heroe;
			})
		)
	}

	actualizarHeroe(heroe: HeroeModel) {

		const heroeAux = {
			// Este operador equivale a copiar todas las propiedades de heroes a heroeAux
			...heroe
		};
		delete heroeAux.id;
		return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeAux);
	}

	borrarHeroe(id: string) {
		return this.http.delete(`${ this.url }/heroes/${ id }.json`);
	}
    
	// Metodo para obtener todos los heroes desde firebase
	getHeroes() {
		return this.http.get(`${this.url}/heroes.json`)
			.pipe( 
				map( resp => this.crearArrayDeHeroes(resp) )
			);
	}

    getHeroe(id: string) {
        // console.log(this.http.get(`${ this.url }/heroes/${ id }.json`));
        return this.http.get(`${ this.url }/heroes/${ id }.json`);
    }

	// Este metodo convierte la respuesta de firebase, en un array de heroeModel para poder iterarlo en la vista
	private crearArrayDeHeroes(heroesObj: object) {
		
		// Esta constante va a almacenar los heroes devueltos por firebase en el formato adecuado
		const heroes: HeroeModel[] = [];

		// Si no hay respuesta se devuelve un array vacio
		if(heroesObj === null) { return []; }
		
		// Iteramos por todas las keys de la respuesta de firebase y lo agregamos los datos en una variable del tipo adecuado, luego agregamos la key al id y finalmente, agregamos el heroes al array que se retornara
		Object.keys(heroesObj).forEach( key => {
			const heroe: HeroeModel = heroesObj[key];
			heroe.id = key;

			heroes.push(heroe);
		});

		return heroes;
	}
}
