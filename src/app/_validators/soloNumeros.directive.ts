import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
    selector: '[OnlyNumber]'
})
export class OnlyNumber {

    //regexStr = /^\.+$/;
    regexStr = '^[0-9]*$';
    //regexStr = '[0-9]+(\.[0-9][0-9]?)?';
    //regexStr = /^[0-9]+(\.[0-9]{1,2})?$/;
    //regexStr = '\\d+(\\.\\d{1,2})?';
    
    constructor(private el: ElementRef) { }
  
    @Input() OnlyNumber: boolean;
  
    @HostListener('keydown', ['$event']) onKeyDown(event) {
      //let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
      let e = <KeyboardEvent> event;
      if (this.OnlyNumber) {
          if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
          // Allow: Ctrl+C
          (e.keyCode == 67 && e.ctrlKey === true) ||
          // Allow: Ctrl+V
          (e.keyCode == 86 && e.ctrlKey === true) ||
          // Allow: Ctrl+X
          (e.keyCode == 88 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
          }
          
        //let ch = String.fromCharCode(e.keyCode);
        let regEx =  new RegExp(this.regexStr);    
        if(regEx.test(e.key))
          return;
        else
           e.preventDefault();
        }
    }
  }


@Directive({
  selector: '[DecimalFormat]'
})
export class DecimalFormat {

regexStr = /^[0-9]+(\.[0-9]{1,2})?$/;

constructor(private el: ElementRef) { }
  
@Input() DecimalFormat: boolean;

@HostListener('blur', ['$event']) onblur($event) {
  let e = <KeyboardEvent> event;
  let ev = <FocusEvent> event;
  if (this.DecimalFormat) {
    let regEx =  new RegExp(this.regexStr);    
    if(regEx.test(e.key))
    {
      console.log('válido');
    }
    else
      console.log('inválido');
    }
  } 
}