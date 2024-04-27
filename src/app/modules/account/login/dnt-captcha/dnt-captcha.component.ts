import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DNTCaptchaApiResponse } from './dnt-captcha-api-response';
// import { DNTCaptchaLanguage } from './dnt-captcha-language';

@Component({
  selector: 'app-dnt-captcha',
  templateUrl: './dnt-captcha.component.html',
  styleUrls: ['./dnt-captcha.component.css'],
})
export class DntCaptchaComponent implements OnInit {
  apiResponse = new DNTCaptchaApiResponse();
  hiddenInputName = 'DNTCaptchaText';
  hiddenTokenName = 'DNTCaptchaToken';
  inputName = 'DNTCaptchaInputText';

  @Input() text = '';
  @Output() textChange = new EventEmitter<string>();

  @Input() token = '';
  @Output() tokenChange = new EventEmitter<string>();

  @Input() inputText = '';
  @Output() inputTextChange = new EventEmitter<string>();

  @Input() placeholder = '';
  @Input() apiUrl: any;
  @Input() backColor = '';
  // @Input() fontName = '';
  // @Input() fontSize: number;
  // @Input() foreColor = '';
  // @Input() language: DNTCaptchaLanguage;
  // @Input() max: number;
  // @Input() min: number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.doRefresh();
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('getCaptchaInfo error: ', error);
    // return Observable.throw(error.statusText);
    throw new Error('Value expected!');
  }

  getCaptchaInfo(): Observable<DNTCaptchaApiResponse> {
    return this.http.get<DNTCaptchaApiResponse>(`${this.apiUrl}`, {
      withCredentials: true /* For CORS */,
    });
  }

  doRefresh() {
    this.inputText = '';
    // this.apiResponse = this.apiUrl;
    // this.text = this.apiUrl.dntCaptchaTextValue;
    // this.onTextChange();
    // this.token = this.apiUrl.dntCaptchaTokenValue;
    // this.onTokenChange();
    this.getCaptchaInfo().subscribe(data => {
      this.apiResponse = data;
      this.text = data.dntCaptchaTextValue;
      this.onTextChange();
      this.token = data.dntCaptchaTokenValue;
      this.onTokenChange();
    });
  }

  onTextChange() {
    this.textChange.emit(this.text);
  }

  onTokenChange() {
    this.tokenChange.emit(this.token);
  }

  onInputTextChange() {
    this.inputTextChange.emit(this.inputText);
  }
}
