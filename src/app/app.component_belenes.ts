import {animate, Component, HostListener, Input, OnInit, state, style, transition, trigger} from "@angular/core";
import {UpdateService} from "./update.service";
import {Evento} from "./evento";
import {DescargarBDService} from "./descargarbd.service";
import {Eventos} from "./eventos";
import {MdSnackBar, MdSnackBarConfig} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [UpdateService, DescargarBDService],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({opacity: 1})),
      state('false', style({opacity: 0})),
      transition('* => *', animate('.3s'))
    ])
  ],
})

export class AppComponent implements OnInit {
  title: string;
  numerDia: string;
  sugerencias: string [];
  nombreDia: string;
  marcaReporte: string;
  marcaReporte2: string;
  audisReporte = 'Auditorios: ';
  minDate = '2017/01/01';
  maxDate = '2020/01/01';
  st_fecha_inicial_reporte = 'Fecha inicial del reporte:';
  st_fecha_final_reporte = 'Fecha final del reporte:';
  bool_fechaInicial = false;
  bool_fechaFinal = false;
  eventosDia: Evento [];
  eventosBuscados: Evento [];
  eventosReporte: Evento [] = [];
  eventosReporteOrg: Evento [] = [];
  eventosReporteCant: any[] = [];
  eventosDetalle: Evento;
  isVisible = true;
  private filtro1 = true;
  private filtro2 = true;
  private filtro3 = true;
  private filtro4 = true;
  private filtro5 = true;
  private filtroc1 = true;
  private filtroc2 = true;
  private filtroc3 = true;
  private filtroc4 = true;
  private filtroc5 = true;
  private bool_dialog_abierto = false;
  private calendarioMinimo: Date;
  private calendarioIrHoy: Date;
  @Input() calendarioActualizarDiasMes: Date;
  private irHoyNumeroDiaMes: Number;
  irHoyNumeroDiaSemana: Number;
  st_fechahoy: string;
  private irHoyAno: Number;
  private irHoyMes: Number;
  private irHoyNumeroMesAno: number;
  st_footer = 'Descargando información...';
  private st_update: string;
  private st_eventos_guardados: string;
  private calendarioUpdate: Date;
  lista_eventos: Evento[];
  private titulos = '';
  private tiposDeEvento = '';
  private nombresOrganizador = '';
  private stNuevoId: string;
  private id_prox = 0;
  fondo_azul = '#0099cc';
  diasemana: number;
  sexta_semana = false;
  diamax = 0;
  eventosDelMes: Eventos[] = new Array(42);
  private meses = [
    'enero', 'febrero', 'marzo',
    'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre',
    'noviembre', 'diciembre'
  ];
  private filtroc = true;
  private filtroe = true;

  constructor(private updateService: UpdateService, private descargarBDService: DescargarBDService, public snackBar: MdSnackBar) {
  }


  ngOnInit(): void {
    this.iniciarObjetos();
    this.irHoy();
    this.getUpdate();
  }

  private iniciarObjetos() {
    this.title = 'Agenda de eventos CUCSH Belenes';
    this.calendarioMinimo = new Date(2016, 0, 1, 0, 0, 0);
    this.calendarioIrHoy = new Date();
    this.irHoyNumeroDiaMes = this.calendarioIrHoy.getDate();
    this.irHoyNumeroDiaSemana = this.calendarioIrHoy.getDay();
    this.irHoyAno = this.calendarioIrHoy.getFullYear();
    this.irHoyMes = this.calendarioIrHoy.getMonth();


    this.calendarioActualizarDiasMes = new Date(
      this.calendarioIrHoy.getFullYear(),
      this.calendarioIrHoy.getMonth(),
      1, 0, 0, 0);
  }

  private irHoy() {
    this.st_fechahoy = this.calendarioIrHoy.getFullYear() + '/' +
      (this.calendarioIrHoy.getMonth() + 1) + '/' + 13;
    console.log('fehca hoy st: ' + this.st_fechahoy);
    if (this.irHoyAno === 2016) {
      this.irHoyNumeroMesAno = this.calendarioIrHoy.getMonth();
    } else {
      this.irHoyNumeroMesAno = this.calendarioIrHoy.getMonth();
      for (let x = 2016; x < this.irHoyAno; x++) {
        this.irHoyNumeroMesAno += 12;
      }
    }
  }

  private getUpdate() {
    console.log('METODO UPDATE');
    this.updateService.getUpdate().subscribe(
      data => {
        this.calendarioUpdate = new Date;
        this.st_footer = 'Actualizado el ' + this.calendarioUpdate.getDate() + ' de ' + this.getMes(this.calendarioUpdate.getMonth()) +
          ' del ' + this.calendarioUpdate.getFullYear() + this.getStringHora(this.calendarioUpdate);
        setTimeout(() => {
          this.getUpdate();
        }, 13000);
        if (this.st_update !== data) {
          this.st_update = data;
          this.descargarBD();
        }
      },
      error => {
        this.st_footer = error;
        setTimeout(() => {
          this.getUpdate();
        }, 13000);
      }
    );
  }

  private getMes(month: number) {
    let mes: string;
    switch (month) {
      case 0:
        mes = 'Enero';
        break;
      case 1:
        mes = 'Febrero';
        break;
      case 2:
        mes = 'Marzo';
        break;
      case 3:
        mes = 'Abril';
        break;
      case 4:
        mes = 'Mayo';
        break;
      case 5:
        mes = 'Junio';
        break;
      case 6:
        mes = 'Julio';
        break;
      case 7:
        mes = 'Agosto';
        break;
      case 8:
        mes = 'Septiembre';
        break;
      case 9:
        mes = 'Octubre';
        break;
      case 10:
        mes = 'Noviembre';
        break;
      case 11:
        mes = 'Diciembre';
        break;
    }
    return mes;
  }

  private getStringHora(d: Date) {
    const alas = ((d.getHours() === 13 || d.getHours() === 1) ? ' a la ' : ' a las ');
    const ampm = (d.getHours() >= 11) ? ' PM' : ' AM';
    const hora = (d.getHours() > 12) ? ' ' + (d.getHours() - 12) : d.getHours();
    const minuto = (new Date().getMinutes() > 9) ? new Date().getMinutes() : '0' + new Date().getMinutes();
    return alas + hora + ':' + minuto + ampm;
  }

  private descargarBD() {
    console.log('METODO DESCARGARBD');
    this.descargarBDService.getBD().subscribe(
      data => {
        this.st_eventos_guardados = data;
        this.llenarArrays();
      },
      error => {
        this.st_footer = error;
        setTimeout(() => {
          this.getUpdate();
        }, 13000);
      }
    );
  }

  private llenarArrays() {
    if (this.st_eventos_guardados.includes('</form>')) {
      this.st_eventos_guardados = this.st_eventos_guardados.split('</form>')[1].trim();
    }

    this.lista_eventos = [];
    if (this.st_eventos_guardados.trim().length > 0) {

      for (const eventos_suelto of this.st_eventos_guardados.trim().split('¦')) {

        if (eventos_suelto.trim() !== ('')) {

          if (!this.titulos.includes(eventos_suelto.trim().split('::')[3].trim())) {
            this.titulos += eventos_suelto.trim().split('::')[3].trim() + '¦';
          }
          if (!this.tiposDeEvento.includes(eventos_suelto.trim().split('::')[5].trim())) {
            this.tiposDeEvento += eventos_suelto.trim().split('::')[5].trim() + '¦';
          }
          if (!this.nombresOrganizador.includes(eventos_suelto.trim().split('::')[6].trim())) {
            this.nombresOrganizador += eventos_suelto.trim().split('::')[6].trim() + '¦';
          }

          this.sugerencias = (this.titulos + this.tiposDeEvento + this.nombresOrganizador).split('¦');

          this.lista_eventos.push(new Evento(
            eventos_suelto.split('::')[0].trim().replace('[^0-9]+', ''),
            eventos_suelto.split('::')[1].trim().replace('[^0-9]+', ''),
            eventos_suelto.split('::')[2].trim().replace('[^0-9]+', ''),
            eventos_suelto.split('::')[3].trim(),
            eventos_suelto.split('::')[4].trim().replace('[^0-9]+', ''),
            eventos_suelto.split('::')[5].trim(),
            eventos_suelto.split('::')[6].trim(),
            eventos_suelto.split('::')[7].trim(),
            eventos_suelto.split('::')[8].trim(),
            eventos_suelto.split('::')[9].trim(),
            eventos_suelto.split('::')[10].trim(),
            eventos_suelto.split('::')[11].trim(),
            eventos_suelto.split('::')[12].trim().replace('[^0-9]+', ''),
            eventos_suelto.trim(),
            this.fondoAuditorio(eventos_suelto.split('::')[4].trim(), eventos_suelto.split('::')[13].trim()),
            // CLASE
            eventos_suelto.split('::')[13].trim(),
            // DEPEDENCIA
            eventos_suelto.split('::')[14].trim(),
            // NOMBRE DEL RESPONSABLE
            eventos_suelto.split('::')[15].trim(),
            // CELULAR DEL RESPONSABLE
            eventos_suelto.split('::')[16].trim(),
            // AULA
            'Aula 1'
          ));

          // COMPROBAMOS EL ID DE CADA EVENTO PARA DETERMINAR SI ES MAYOR AL ANTERIOR Y AL FINAL OBTENER EL ID MAS ALTO
          if (parseInt(eventos_suelto.split('::')[12].trim(), 10) > this.id_prox) {
            this.id_prox = parseInt(eventos_suelto.split('::')[12].trim(), 10);
          }
        }
      }

      this.stNuevoId = '' + (this.id_prox + 1);
      if (this.stNuevoId.length === 1) {
        this.stNuevoId = '000' + this.stNuevoId;
      } else if (this.stNuevoId.length === 2) {
        this.stNuevoId = '00' + this.stNuevoId;
      } else if (this.stNuevoId.length === 3) {
        this.stNuevoId = '0' + this.stNuevoId;
      }
    }
    this.actualizarDiasDelMes();
  }

  private fondoAuditorio(st: string, c: string) {
    switch (st) {
      case '1':
        if (c === 'C') {
          st = '#a45d5d';
        } else {
          st = '#7D1818';
        }
        break;
      case '2':
        if (c === 'C') {
          st = '#7197ac';
        } else {
          st = '#356B89';
        }
        break;
      case '3':
        if (c === 'C') {
          st = '#5f8375';
        } else {
          st = '#1B4E3B';
        }
        break;
      case '4':
        if (c === 'C') {
          st = '#8c8c8e';
        } else {
          st = '#5B5B5E';
        }
        break;
      case '5':
        if (c === 'C') {
          st = '#c79255';
        } else {
          st = '#AF640D';
        }
        break;
    }
    return st;
  }

  private actualizarDiasDelMes() {
    this.eventosDelMes.length = 42;
    this.diasemana = ((this.calendarioActualizarDiasMes.getDay() === 0) ? 7 : this.calendarioActualizarDiasMes.getDay());
    const ano = this.calendarioActualizarDiasMes.getFullYear();
    let dia_inicial_del_mes = 0;
    if (ano === 2016) {
      dia_inicial_del_mes = this.obtenerNumeroDia(this.calendarioActualizarDiasMes);
    } else {
      dia_inicial_del_mes = this.obtenerNumeroDia(this.calendarioActualizarDiasMes);
      for (let x = 2016; x < ano; x++) {
        dia_inicial_del_mes += this.obtenerNumeroDia(new Date(x, 11, 31));
      }
    }

    for (let x = 0; x < 41; x++) {
      const evs: Evento[] = [];
      for (const evento_suelto of this.lista_eventos) {
        if (parseInt(evento_suelto.fecha.replace('[^0-9]+', ''), 10) === ((x - this.diasemana + 1) + dia_inicial_del_mes )
          && evento_suelto.statusEvento !== ('X') && this.filtro(evento_suelto.auditorio, evento_suelto.clase)) {
          evs.push(evento_suelto);
        }
      }
      this.eventosDelMes[x] = new Eventos(evs);
    }
    this.diamax = this.diasemana + this.obtenerDiaMaximoDelMes(this.calendarioActualizarDiasMes);
    this.sexta_semana = this.diamax >= 37;
    this.isVisible = true;
  }

  private filtro(auditorio: string, clase: string) {
    let f = false;
    switch (auditorio) {
      case '1':
        f = this.filtro1;
        if (f) {
          if (clase === 'C') {
            f = this.filtroc;
          }else {
            f = this.filtroe;
          }
        }
        break;
      case '2':
        f = this.filtro2;
        if (f) {
          if (clase === 'C') {
            f = this.filtroc;
          }else {
            f = this.filtroe;
          }
        }
        break;
      case '3':
        f = this.filtro3;
        if (f) {
          if (clase === 'C') {
            f = this.filtroc;
          }else {
            f = this.filtroe;
          }
        }
        break;
      case '4':
        f = this.filtro4;
        if (f) {
          if (clase === 'C') {
            f = this.filtroc;
          }else {
            f = this.filtroe;
          }
        }
        break;
      case '5':
        f = this.filtro5;
        if (f) {
          if (clase === 'C') {
            f = this.filtroc;
          }else {
            f = this.filtroe;
          }
        }
        break;
    }

    return f;
  }

  private filtroRepo(auditorio: string) {
    let f = false;
    switch (auditorio) {
      case '1':
        f = this.filtroc1;
        break;
      case '2':
        f = this.filtroc2;
        break;
      case '3':
        f = this.filtroc3;
        break;
      case '4':
        f = this.filtroc4;
        break;
      case '5':
        f = this.filtroc5;
        break;
    }
    return f;
  }

  private obtenerNumeroDia(calendarioActualizarDiasMes: Date) {
    const feb = this.daysInFebruary(calendarioActualizarDiasMes.getFullYear());
    const aggregateMonths = [
      0, // January
      31, // February
      31 + feb, // March
      31 + feb + 31, // April
      31 + feb + 31 + 30, // May
      31 + feb + 31 + 30 + 31, // June
      31 + feb + 31 + 30 + 31 + 30, // July
      31 + feb + 31 + 30 + 31 + 30 + 31, // August
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31, // September
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
      31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
    ];
    return aggregateMonths[calendarioActualizarDiasMes.getMonth()] + calendarioActualizarDiasMes.getDate();
  }

  private daysInFebruary(year: number) {
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
      // Leap year
      return 29;
    } else {
      // Not a leap year
      return 28;
    }
  }

  private obtenerDiaMaximoDelMes(date: Date) {
    const month = date.getMonth();
    let n = 0;
    if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
      n = 31;
    } else {
      if (month === 1) {
        n = this.daysInFebruary(date.getFullYear());
      } else {
        n = 30;
      }
    }
    return n;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.bool_dialog_abierto) {
      if (event.keyCode === 39) {
        this.calendarioActualizarDiasMes =
          new Date(this.calendarioActualizarDiasMes.getFullYear(), this.calendarioActualizarDiasMes.getMonth() + 1, 1);
        this.isVisible = false;
        setTimeout(() => {
          this.llenarArrays();
        }, 300);
      } else if (event.keyCode === 37) {
        this.calendarioActualizarDiasMes =
          new Date(this.calendarioActualizarDiasMes.getFullYear(), this.calendarioActualizarDiasMes.getMonth() - 1, 1);
        this.isVisible = false;
        setTimeout(() => {
          this.llenarArrays();
        }, 300);
      }
    }
  }

  mesAnterior() {
    this.calendarioActualizarDiasMes =
      new Date(this.calendarioActualizarDiasMes.getFullYear(), this.calendarioActualizarDiasMes.getMonth() + 1, 1);
    this.isVisible = false;
    setTimeout(() => {
      this.llenarArrays();
    }, 300);
  }

  mesPosterior() {
    this.calendarioActualizarDiasMes =
      new Date(this.calendarioActualizarDiasMes.getFullYear(), this.calendarioActualizarDiasMes.getMonth() - 1, 1);
    this.isVisible = false;
    setTimeout(() => {
      this.llenarArrays();
    }, 300);
  }

  cambiarFecha(fecha: string, closingReason: any) {

    this.bool_dialog_abierto = false;
    if (closingReason.confirmed) {
      // SE SELECIONO LA FECHA INICIAL
      if (this.bool_fechaInicial && fecha) {
        this.bool_fechaInicial = false;
        this.st_fecha_inicial_reporte = fecha;
        this.minDate = fecha;
        this.maxDate = '2020/01/01';
      } else if (this.bool_fechaFinal && fecha) {
        this.bool_fechaFinal = false;
        this.st_fecha_final_reporte = fecha;
        this.maxDate = fecha;
      } else if (fecha) {
        if (this.calendarioActualizarDiasMes.toDateString() !== new Date(parseInt(fecha.split('/')[0], 10),
            parseInt(fecha.split('/')[1], 10) - 1, 1).toDateString()) {
          this.isVisible = false;
          this.calendarioActualizarDiasMes =
            new Date(parseInt(fecha.split('/')[0], 10), parseInt(fecha.split('/')[1], 10) - 1, 1);
          setTimeout(() => {
            this.llenarArrays();
          }, 300);
        }
      }
    }
  }

  dialogAbierto() {
    this.bool_dialog_abierto = true;
  }

  checkboxchange(n: number, b: boolean) {
    switch (n) {
      case 1:
        this.filtro1 = b;
        break;
      case 2:
        this.filtro2 = b;
        break;
      case 3:
        this.filtro3 = b;
        break;
      case 4:
        this.filtro4 = b;
        break;
      case 5:
        this.filtro5 = b;
        break;
      case 6:
        this.filtroc = b;
        break;
      case 7:
        this.filtroe = b;
        break;
    }
    this.llenarArrays();
  }

  checkboxchangeReporte(n: number, b: boolean) {
    switch (n) {
      case 1:
        this.filtroc1 = b;
        break;
      case 2:
        this.filtroc2 = b;
        break;
      case 3:
        this.filtroc3 = b;
        break;
      case 4:
        this.filtroc4 = b;
        break;
      case 5:
        this.filtroc5 = b;
        break;
    }
  }

  clickbotones(n: number) {
    this.numerDia = (n - this.diasemana) + '';
    this.eventosDia = this.eventosDelMes[n - 2].eventos;
    switch (n % 7) {
      case 2:
        this.nombreDia = 'lun.';
        break;
      case 3:
        this.nombreDia = 'mar.';
        break;
      case 4:
        this.nombreDia = 'mié.';
        break;
      case 5:
        this.nombreDia = 'jue.';
        break;
      case 6:
        this.nombreDia = 'vie.';
        break;
    }
  }

  clickEvento(e: Evento) {
    this.eventosDetalle = e;
  }

  getAuditorio(s: string) {
    let st: string;
    switch (s) {
      case '1':
        st = 'Edificio A';
        break;
      case '2':
        st = 'Edificio B';
        break;
      case '3':
        st = 'Edificio C';
        break;
      case '4':
        st = 'Edificio D';
        break;
      case '5':
        st = 'Edificio F';
        break;
    }
    return st;
  }

  horasATetxto(st: string) {
    const numero = parseInt(st, 10);
    let am_pm;
    let st_min;
    let st_hora;

    let hora: number = Math.floor(numero / 2) + 7;
    if (hora > 12) {
      hora = hora - 12;
      am_pm = ' PM';
    } else {
      am_pm = ' AM';
    }

    if (hora < 10) {
      st_hora = '0' + hora;
    } else {
      st_hora = '' + hora;
    }

    if (numero % 2 === 0) {
      st_min = '00';
    } else {
      st_min = '30';
    }

    return st_hora + ':' + st_min + am_pm;
  }

  fecha(f: string) {
    if (f) {
      const c = new Date(2016, 0, 1);
      c.setDate(c.getDate() + (parseInt(f, 10) - 1));
      return c;
    }
  }

  buscar(busqueda: string) {
    this.eventosBuscados = [];
    if (busqueda && busqueda.length > 2) {
      for (const evento of this.lista_eventos) {
        if (evento.tag.includes(busqueda) && evento.statusEvento !== 'X') {
          this.eventosBuscados.push(evento);
        }
      }
    }
  }

  fechaInicialReporte() {
    this.minDate = '2017/01/01';
    this.bool_fechaInicial = true;
    this.bool_dialog_abierto = true;
  }

  fechafinalReporte() {
    this.bool_fechaFinal = true;
    this.bool_dialog_abierto = true;
  }

  irAFecha() {
    this.minDate = '2017/01/01';
    this.maxDate = '2020/01/01';
  }

  generarReporte() {
    this.eventosReporteOrg = [];
    this.eventosReporte = [];

    if (this.filtroc1 && this.filtroc2 && this.filtroc3 && this.filtroc4 && this.filtroc5) {
      this.audisReporte += 'Todos.';
    } else {
      if (this.filtroc1) {
        this.audisReporte += 'Edificio A, ';
      }
      if (this.filtroc2) {
        this.audisReporte += 'Edificio B, ';
      }
      if (this.filtroc3) {
        this.audisReporte += 'Edificio C, ';
      }
      if (this.filtroc4) {
        this.audisReporte += 'Edificio D, ';
      }
      if (this.filtroc5) {
        this.audisReporte += 'Edificio F.';
      } else {
        if (this.filtroc4) {
          this.audisReporte = this.audisReporte.replace('Adalverto Naconstro, ', 'Adalverto Naconstro. ');
        } else if (this.filtroc3) {
          this.audisReporte = this.audisReporte.replace('Edificio C, ', 'Edificio C. ');
        } else if (this.filtroc2) {
          this.audisReporte = this.audisReporte.replace('Edificio B, ', 'Edificio B. ');
        } else if (this.filtroc1) {
          this.audisReporte = this.audisReporte.replace('Edificio A, ', 'Edificio A. ');
        }
      }
    }

    const m1: number = parseInt(this.st_fecha_inicial_reporte.split('/')[1], 10) - 1;
    const m2: number = parseInt(this.st_fecha_final_reporte.split('/')[1], 10) - 1;

    if (this.st_fecha_inicial_reporte !== this.st_fecha_final_reporte) {
      this.marcaReporte = 'Reporte de eventos del día ' + this.st_fecha_inicial_reporte.split('/')[2] + '/'
        + this.meses[m1] + '/' +
        +this.st_fecha_inicial_reporte.split('/')[0] + ' al día ' + this.st_fecha_final_reporte.split('/')[2] + '/'
        + this.meses[m2] + '/' +
        +this.st_fecha_final_reporte.split('/')[0] + '.';
    } else {
      this.marcaReporte = 'Reporte de eventos del día ' + this.st_fecha_inicial_reporte.split('/')[2] + '/'
        + this.meses[m1] + '/' +
        +this.st_fecha_inicial_reporte.split('/')[0] + '.';
    }

    const cal_rep1 = new Date(parseInt(this.st_fecha_inicial_reporte.split('/')[0], 10), m1,
      parseInt(this.st_fecha_inicial_reporte.split('/')[2], 10));
    const cal_rep2 = new Date(parseInt(this.st_fecha_final_reporte.split('/')[0], 10), m2,
      parseInt(this.st_fecha_final_reporte.split('/')[2], 10));
    const cal_n = new Date();
    const m0 = cal_n.getMonth();

    const ampm = (cal_n.getHours() >= 12) ? ' PM.' : ' AM.';
    const hora = (cal_n.getHours() > 12) ? ' ' + (cal_n.getHours() - 12) : cal_n.getHours();
    const ala = (cal_n.getHours() === 13) ? ' a la ' : ' a las ';
    const minuto = (cal_n.getMinutes() > 10) ? cal_n.getMinutes() : '0' + cal_n.getMinutes();

    this.marcaReporte2 = 'Reporte generado el día ' + cal_n.getDate() + '/' +
      this.meses[m0] + '/' + cal_n.getFullYear() + ala + hora + ':' + minuto + ampm;

    let f = '0';
    for (let x = this.obtenerDiaDesde2016(cal_rep1); x <= this.obtenerDiaDesde2016(cal_rep2); x++) {
      for (const evento_suelto of this.lista_eventos) {
        if (parseInt(evento_suelto.fecha.replace('[^0-9]+', ''), 10) === x && evento_suelto.statusEvento !== ('X') &&
          this.filtroRepo(evento_suelto.auditorio)) {
          let resto = this.eventosReporte.length % 10;
          console.log('tamaño: ' + this.eventosReporte.length);
          console.log('resto: ' + resto);
          if (evento_suelto.fecha !== f || resto === 0) {
            f = evento_suelto.fecha;
            this.eventosReporte.push(new Evento(
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              '#B71C1C',
              f,
              f,
              f,
              f,
              f
            ));
          }

          resto = this.eventosReporte.length % 10;
          if (evento_suelto.fecha !== f || resto === 0) {
            f = evento_suelto.fecha;
            this.eventosReporte.push(new Evento(
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              f,
              '#B71C1C',
              f,
              f,
              f,
              f,
              f
            ));
          }
          this.eventosReporte.push(evento_suelto);
          this.eventosReporteOrg.push(evento_suelto);
        }
      }
    }

    for (let x = 0; x <= this.eventosReporte.length; x += 20) {
      this.eventosReporteCant.push(x);
    }
  }

  private obtenerDiaDesde2016(cal: Date) {
    if (cal.getFullYear() === 2016) {
      return this.obtenerNumeroDia(cal);
    } else {
      let nd = this.obtenerNumeroDia(cal);
      for (let x = 2016; x < cal.getFullYear(); x++) {
        nd += this.obtenerNumeroDia(new Date(x, 11, 31));
      }
      return nd;
    }
  }

  impri() {
    const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;

    const height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    const printContents = document.getElementById('re').innerHTML;
    const popupWin = window.open('', '_blank', 'width=' + width + ',height=' + height + '\'');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles_belenes.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

  bottonReporte() {
    if (this.st_fecha_final_reporte === 'Fecha final del reporte:' || this.st_fecha_inicial_reporte === 'Fecha inicial del reporte:') {
      return true;
    } else {
      return (!this.filtroc1 && !this.filtroc2 && !this.filtroc3 && !this.filtroc4 && !this.filtroc5);
    }
  }

  mostarSnack() {
    const config = new MdSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open('Debes llenar toda la información antes de generar el reporte', '', config);
  }
}
