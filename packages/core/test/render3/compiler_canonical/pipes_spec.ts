/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, HostBinding, HostListener, Injectable, Input, NgModule, OnDestroy, Optional, Pipe, PipeTransform, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef} from '../../../src/core';
import * as $r3$ from '../../../src/core_render3_private_export';
import {containerEl, renderComponent, toHtml} from '../render_util';

/// See: `normative.md`
describe('pipes', () => {
  type $any$ = any;
  type $boolean$ = boolean;

  let myPipeTransformCalls = 0;
  let myPurePipeTransformCalls = 0;

  @Pipe({
    name: 'myPipe',
    pure: false,
  })
  class MyPipe implements PipeTransform,
      OnDestroy {
    private numberOfBang = 1;

    transform(value: string, size: number): string {
      let result = value.substring(size);
      for (let i = 0; i < this.numberOfBang; i++) result += '!';
      this.numberOfBang++;
      myPipeTransformCalls++;
      return result;
    }

    ngOnDestroy() { this.numberOfBang = 1; }

    // NORMATIVE
    static ngPipeDef = $r3$.ɵdefinePipe({
      type: MyPipe,
      factory: function MyPipe_Factory() { return new MyPipe(); },
      pure: false,
    });
    // /NORMATIVE
  }

  @Pipe({
    name: 'myPurePipe',
    pure: true,
  })
  class MyPurePipe implements PipeTransform {
    transform(value: string, size: number): string {
      myPurePipeTransformCalls++;
      return value.substring(size);
    }

    // NORMATIVE
    static ngPipeDef = $r3$.ɵdefinePipe({
      type: MyPurePipe,
      factory: function MyPurePipe_Factory() { return new MyPurePipe(); },
      pure: true,
    });
    // /NORMATIVE
  }

  // NORMATIVE
  const $MyPurePipe_ngPipeDef$ = MyPurePipe.ngPipeDef;
  const $MyPipe_ngPipeDef$ = MyPipe.ngPipeDef;
  // /NORMATIVE

  it('should render pipes', () => {
    type $MyApp$ = MyApp;
    myPipeTransformCalls = 0;
    myPurePipeTransformCalls = 0;

    @Component({template: `{{name | myPipe:size | myPurePipe:size }}`})
    class MyApp {
      name = '12World';
      size = 1;

      // NORMATIVE
      static ngComponentDef = $r3$.ɵdefineComponent({
        type: MyApp,
        selector: [[['my-app'], null]],
        factory: function MyApp_Factory() { return new MyApp(); },
        template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
          if (cm) {
            $r3$.ɵT(0);
            $r3$.ɵPp(1, $MyPipe_ngPipeDef$);
            $r3$.ɵPp(2, $MyPurePipe_ngPipeDef$);
          }
          $r3$.ɵt(0, $r3$.ɵi1('', $r3$.ɵpb2(1, $r3$.ɵpb2(2, ctx.name, ctx.size), ctx.size), ''));
        }
      });
      // /NORMATIVE
    }

    let myApp: MyApp = renderComponent(MyApp);
    expect(toHtml(containerEl)).toEqual('World!');
    expect(myPurePipeTransformCalls).toEqual(1);
    expect(myPipeTransformCalls).toEqual(1);

    $r3$.ɵdetectChanges(myApp);
    expect(toHtml(containerEl)).toEqual('World!!');
    expect(myPurePipeTransformCalls).toEqual(1);
    expect(myPipeTransformCalls).toEqual(2);

    myApp.name = '34WORLD';
    $r3$.ɵdetectChanges(myApp);
    expect(toHtml(containerEl)).toEqual('WORLD!!!');
    expect(myPurePipeTransformCalls).toEqual(2);
    expect(myPipeTransformCalls).toEqual(3);
  });

  it('should render many pipes and forward the first instance (pure or impure pipe)', () => {
    type $MyApp$ = MyApp;
    type $MyPurePipe$ = MyPurePipe;
    myPipeTransformCalls = 0;
    myPurePipeTransformCalls = 0;

    @Directive({
      selector: '[oneTimeIf]',
    })
    class OneTimeIf {
      @Input() oneTimeIf: any;
      constructor(private view: ViewContainerRef, private template: TemplateRef<any>) {}
      ngDoCheck(): void {
        if (this.oneTimeIf) {
          this.view.createEmbeddedView(this.template);
        }
      }
      // NORMATIVE
      static ngDirectiveDef = $r3$.ɵdefineDirective({
        type: OneTimeIf,
        selector: [[['', 'oneTimeIf', ''], null]],
        factory: () => new OneTimeIf($r3$.ɵinjectViewContainerRef(), $r3$.ɵinjectTemplateRef()),
        inputs: {oneTimeIf: 'oneTimeIf'}
      });
      // /NORMATIVE
    }

    @Component({
      template: `{{name | myPurePipe:size}}{{name | myPurePipe:size}}
       <div *oneTimeIf="more">{{name | myPurePipe:size}}</div>`
    })
    class MyApp {
      name = '1World';
      size = 1;
      more = true;

      // NORMATIVE
      static ngComponentDef = $r3$.ɵdefineComponent({
        type: MyApp,
        selector: [[['my-app'], null]],
        factory: function MyApp_Factory() { return new MyApp(); },
        template: function MyApp_Template(ctx: $MyApp$, cm: $boolean$) {
          let $pi$: $MyPurePipe$;
          if (cm) {
            $r3$.ɵT(0);
            $pi$ = $r3$.ɵPp(1, $MyPurePipe_ngPipeDef$);
            $r3$.ɵT(2);
            $r3$.ɵPp(3, $MyPurePipe_ngPipeDef$, $pi$);
            $r3$.ɵC(4, C4, '', ['oneTimeIf', '']);
          }
          $r3$.ɵt(0, $r3$.ɵi1('', $r3$.ɵpb2(1, ctx.name, ctx.size), ''));
          $r3$.ɵt(2, $r3$.ɵi1('', $r3$.ɵpb2(3, ctx.name, ctx.size), ''));
          $r3$.ɵp(4, 'oneTimeIf', $r3$.ɵb(ctx.more));
          $r3$.ɵcR(4);
          $r3$.ɵcr();

          function C4(ctx1: $any$, cm: $boolean$) {
            if (cm) {
              $r3$.ɵE(0, 'div');
              $r3$.ɵT(1);
              $r3$.ɵPp(2, $MyPurePipe_ngPipeDef$, $pi$);
              $r3$.ɵe();
            }
            $r3$.ɵt(1, $r3$.ɵi1('', $r3$.ɵpb2(2, ctx.name, ctx.size), ''));
          }
        }
      });
      // /NORMATIVE
    }

    // NON-NORMATIVE
    MyApp.ngComponentDef.directiveDefs = [OneTimeIf.ngDirectiveDef];
    // /NON-NORMATIVE

    let myApp: MyApp = renderComponent(MyApp);
    expect(toHtml(containerEl)).toEqual('WorldWorld<div>World</div>');
    expect(myPurePipeTransformCalls).toEqual(3);
    expect(myPipeTransformCalls).toEqual(0);
  });
});
