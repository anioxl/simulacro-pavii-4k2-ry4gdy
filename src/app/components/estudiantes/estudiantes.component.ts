import { Component, OnInit } from '@angular/core';
import { Articulo } from '../../models/articulo';
import { Estudiante } from '../../models/estudiante';
import { Barrio } from '../../models/barrio';
import { EstudiantesService } from '../../services/estudiantes.service';
import { BarriosService } from '../../services/barrios.service';
import { ArticuloFamilia } from '../../models/articulo-familia';
import { ArticulosService } from '../../services/articulos.service';
import { ArticulosFamiliasService } from '../../services/articulos-familias.service';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  Titulo = 'Articulos';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)',
  };
  AccionABMC = 'L'; // inicialmente inicia en el Listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...',
  };

  Items: Estudiante[] = null;
  RegistrosTotal: number;
  Barrios: Barrio[] = [];

  Pagina = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesRegular = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' },
  ];

  FormRegistro = new FormGroup({
    EstudianteID: new FormControl(0),
    EstudianteAyN: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(55),
    ]),

    EstudianteLegajo: new FormControl(null, [
      Validators.required,
      Validators.pattern('[0-9]{1,7}'),
    ]),

    BarrioID: new FormControl('', [Validators.required]),
    EstudianteFechaNac: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
      ),
    ]),
    EstudianteRegular: new FormControl(true),
  });

  submitted = false;

  constructor(
    //private articulosService: MockArticulosService,
    //private articulosFamiliasService: MockArticulosFamiliasService,
    private articulosService: ArticulosService,
    private articulosFamiliasService: ArticulosFamiliasService,
    private estudiantesService: EstudiantesService,
    private barriosService: BarriosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    // this.FormBusqueda = this.formBuilder.group({
    //   Nombre: [''],
    //   Activo: [null]
    // });
    // this.FormRegistro = this.formBuilder.group({
    //   IdArticulo: [0],
    //   Nombre: [
    //     '',
    //     [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
    //   ],
    //   Precio: [null, [Validators.required, Validators.pattern('[0-9]{1,7}')]],
    //   Stock: [null, [Validators.required, Validators.pattern('[0-9]{1,7}')]],
    //   CodigoDeBarra: [
    //     '',
    //     [Validators.required, Validators.pattern('[0-9]{13}')]
    //   ],
    //   IdArticuloFamilia: ['', [Validators.required]],
    //   FechaAlta: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.pattern(
    //         '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
    //       )
    //     ]
    //   ],
    //   Activo: [true]
    // });

    this.GetBarrios();
    //this.Buscar();
  }

  GetBarrios() {
    this.barriosService.get().subscribe((res: Barrio[]) => {
      this.Barrios = res;
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Regular: true, EstudianteID: 0 });
    this.submitted = false;
    //this.FormRegistro.markAsPristine();  // incluido en el reset
    //this.FormRegistro.markAsUntouched(); // incluido en el reset
  }

  //Buscar segun los filtros, establecidos en FormRegistro
   Buscar() {
     this.estudiantesService
       .get().subscribe((res: any) => {
         this.Items = res;
         //this.RegistrosTotal = res.RegistrosTotal;
       });
   }

  // Obtengo un registro especifico según el Id
  BuscarPorId(Item, AccionABMC) {
  window.scroll(0, 0); // ir al incio del scroll

    this.articulosService.getById(Item.IdArticulo).subscribe((res: any) => {
       this.FormRegistro.patchValue(res);

      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
       var arrFecha = res.EstudianteFechaNac.substr(0, 10).split('-');
       this.FormRegistro.controls.EstudianteFechaNac.patchValue(
         arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
       );

       this.AccionABMC = AccionABMC;
     });
   }

  Consultar(Item) {
  this.BuscarPorId(Item, 'C');
   }

  // comienza la modificacion, luego la confirma con el metodo Grabar
  // Modificar(Item) {
  //   if (!Item.Activo) {
  //     this.modalDialogService.Alert(
  //       'No puede modificarse un registro Inactivo.'
  //     );
  //     return;
  //   }
  //   this.submitted = false;
  //   this.FormRegistro.markAsUntouched();
  //   this.BuscarPorId(Item, 'M');
  // }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.EstudianteFechaNac.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.EstudianteFechaNac = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
      if (this.AccionABMC == 'A') {
      // if(itemCopy.EstudianteID == 0 || itemCopy.EstudianteID == null) {
        itemCopy.EstudianteID = 0;
        this.estudiantesService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    }
  }

  // representa la baja logica
  // ActivarDesactivar(Item) {
  //   this.modalDialogService.Confirm(
  //     'Esta seguro de ' +
  //       (Item.Activo ? 'desactivar' : 'activar') +
  //       ' este registro?',
  //     undefined,
  //     undefined,
  //     undefined,
  //     () =>
  //       this.articulosService
  //         .delete(Item.IdArticulo)
  //         .subscribe((res: any) => this.Buscar()),
  //     null
  //   );
  // }

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }

  GetBarriosNombre(Id) {
    var Nombre = this.Barrios.find((x) => x.BarrioID === Id)?.BarrioNombre;
    return Nombre;
  }
}
