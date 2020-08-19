import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NotesService } from './services/notes.service';
import { MatSnackBar } from '@angular/material';
import { getAllRouteGuards } from '@angular/router/src/utils/preactivation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Pueden dejar aquí sus dudas sobre las materias y las responderemos en las Sesiones en vivo de Preguntas y Respuestas - Tutorías';
  year:number = 2019;
  month:number= 0;

  /* https://material.angular.io/components/expansion/overview  */
  panelOpenState = false;

  categoriasNota:any = ['FEL001: Fundamentos de e-learning', 'INF001: Informática básica'];

  /* nota actual */
  nota:any = {};
  
  notasFirebase:any = [];

  tituloBoton:string = "Crear Pregunta nueva";

  /** Tabs control */
  step = -1;//así arrancan todas colapsadas/contraídas por defecto

  /**
   * Para evauar el tamaño de la pantalla
   */
  mobile:boolean = false;

  /**
   * Para filtrar Preguntas, por defecto se ven todas
   */
  filtro:string = 'TODO';

  /**
   * En caso de crear un curso, EDITARLO aquí
   */
  curso:any = {
    id: 'ORA003',
    cod: 'ORA003',
    nombre: 'Oralidad 3 - Portugués, Francés e Italiano'
  };
  cursos:any = [];

  constructor(private swUpdate: SwUpdate,
      private notesService: NotesService,
      private snackBar: MatSnackBar){

    /**
     * TIP: lo que aquí se llama se hace cuando ha CARGADO este componente
     * NO hay que esperar a que el componente cargue totalmente para llamar a un servicio externo
     */
    this.notesService.getNotes().valueChanges()
        .subscribe( (firebaseNotas) => {
          this.notasFirebase = firebaseNotas.reverse(); //invierte el orden
          console.log("constructor() - notas desde Firebase", firebaseNotas);
        }
    );

    /***************************************************
     * Solo en caso de crear UN CURSO, no hay formulario para crearlos por ahora
     * /
    this.notesService.createCurso(this.curso).then( () => {
      console.log('Curso creado',this.curso);
    });
    */
   
    this.notesService.getCursos().valueChanges()
        .subscribe( (firebaseCursos) => {
          this.cursos = firebaseCursos;
          console.log("constructor() - CURSOS desde Firebase", firebaseCursos);
        }
    );

    var d = new Date();
    this.year  = d.getFullYear();
    this.month = d.getMonth(); 
  }

  ngOnInit():void {

    if ( window.screen.width <= 768 ){ // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    console.log("mobile",this.mobile,"screen=",window.screen.width);

    /**
     * TIP: lo que aquí se llama se hace cuando ha terminado de INICIALIZARSE el COMPONENTE TOTALMENTE
     */

    //para validar que el Browser lo soporte
    if ( this.swUpdate.isEnabled ){

      // detecta y somos notificados de cuando haya una nueva versión disponible
      this.swUpdate.available

      //cada que haya stream de información nuevo disponible en el Service Worker, ejecutaremos lo siguiente
      .subscribe(() => {
        window.location.reload();
      })
    }
  }

  /**
   * Enviar nota a Firebase
   */
  guardarNota(){
    
    if ( this.nota.titulo === undefined || this.nota.titulo === "" 
        || this.nota.cuerpo === undefined || this.nota.cuerpo === "" 
        || this.nota.categoria === undefined || this.nota.categoria === "" ){

      this.snackBar.open('Debe diligenciar los 3 campos para crear una nueva Pregunta', 'X', {
        duration: 5000,
      });
      return false;
    }

    var edicion = false;

    if ( !this.nota.id ){
      /*
       * en este caso el ID no existe, se crea uno nuevo para una NOTA NUEVA
       * timestamp formato UNIX en milisegundos
       */
      this.nota.id = Date.now();
      edicion = false;
    } else {
      /* 
       * como ya existe, FIREBASE detectará que es un ID que ya tiene 
       * por lo que NO creará una nota nueva sino que EDITARÁ el registr con el ID existente
       */
      edicion = true;
    }

    console.log("guardarNota()", this.nota);

    this.notesService.createNote(this.nota).then( () => {
      this.nota = {};
      var msg = ( edicion ) ? 'Cambios guardados' : 'Pregunta creada!';
      this.snackBar.open(msg, "Gracias", {
        duration: 4000,
      });
      this.tituloBoton = "Crear Pregunta nueva";
    });
  }

  seleccionarNota = (notaObj) => {
    console.log("seleccionarNota()", notaObj);
    this.nota = notaObj;
    this.tituloBoton = 'Guardar cambios en esta Pregunta';
    this.setStep(0);
  };

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  /**
   * Para eliminar se necesita la CLAVE secreta SEGUIDO del codigo de la materia
   * @param nota 
   */
  eliminarNota(nota){
    //const rsp = confirm('¿Eliminar nota "' + nota.titulo + '" ?');
    const rsp = prompt('Ingrese clave para eliminar...');
    
    let cod = this.extraerCodigoDeCategoria( nota.categoria );
    console.error(rsp,'cod:',cod);

    if( rsp === 'd313t3' + cod ){

      this.notesService.deleteNote(nota)
        .then( ()=> {
          this.limpiarNota();
          this.snackBar.open('Pregunta eliminada.', null, {
            duration: 3000
          })
        });
    } else {
      this.setStep(1);
    }
    this.setStep(1);
  }

  limpiarNota(){
    this.nota = {};
  }

  /**
   * @param materia Ej: "INF001: Informática básica "
   * @return Ej: "INF001"
   */
  extraerCodigoDeCategoria(materia:string){
    
    var index = materia.indexOf(":");

    return materia.substring(0, index);
  }
}