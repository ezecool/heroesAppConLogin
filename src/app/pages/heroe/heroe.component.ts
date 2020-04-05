import { Component, OnInit } from '@angular/core';
import { HeroeModel } from 'src/app/models/heroe.model';
import { HeroesService } from 'src/app/services/heroes.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

	heroe = new HeroeModel();

	constructor(private heroesService: HeroesService, private ruta: ActivatedRoute, private router: Router) {	}

	ngOnInit() {
		const id = this.ruta.snapshot.paramMap.get('id');
		if (id !== 'nuevo') {
				this.heroesService.getHeroe(id).subscribe( (resp: HeroeModel) => {
						this.heroe = resp;
						this.heroe.id = id;
				});
		};
	}

	guardar(form: NgForm) {
		if(!form.valid) {
			return;
		};

		Swal.fire({
			title: 'Espere',
			text: 'Guardando los datos del heroe...',
			icon: 'info',
			allowOutsideClick: false
		});
		Swal.showLoading();
		
		let peticion: Observable<any>;

		if (this.heroe.id) {
			peticion = this.heroesService.actualizarHeroe(this.heroe);
		} else {
			peticion = this.heroesService.crearHeroe(this.heroe);
		}

    // Aca habria que confirmar que la operacion se concreto antes de mandar el mensaje de confirmacion
		peticion.subscribe( resp => {
      this.router.navigate(['/heroes']);
			Swal.fire({
				title: this.heroe.nombre,
				text: 'Se actualizo correctamente',
				icon: 'success'
			})
		});
    }
    
}
