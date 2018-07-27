import {Component, Injectable} from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct,NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n){//,private ngbDateParserFormatter: NgbDateParserFormatter) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}/${date.month}/${date.year}`;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${date.year}/${date.month}/${date.day}` :
        '';
  }

}


@Injectable()
export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
  format(date: NgbDateStruct): string {
    // return date ?
    //     `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
    //     '';
    if(date)
    {
      return `${date.day.toString().length>1?date.day:'0'+date.day}/${date.month.toString().length>1? date.month: '0' + date.month}/${date.year}`;
    }
    else 
      return null;
  }

    parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      // if (dateParts.length === 1 && isNumber(dateParts[0])) {
      //   return {year: toInteger(dateParts[0]), month: null, day: null};
      // } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
      //   return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null};
      // } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
      //   return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2])};
      // }
      return {year: Number.parseInt(dateParts[0]), month: Number.parseInt(dateParts[1]), day: Number.parseInt(dateParts[2])};
    }
    return null;
  }

}

