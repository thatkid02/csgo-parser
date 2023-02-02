import { AnimationPlayer, AnimationBuilder, animate, style } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @ViewChildren('element') itemsView: QueryList<ElementRef>;
  private player: AnimationPlayer;
  images: string[];
  length: number=0;
  animates: number[];
  array: number[];

  @Input() radius: number;
  @Input() timer = 250;
  @Input() top: number = 80;
  @Input() minScale: number = 0.5;
  @Input('images') set _(value: string[]) {
    this.images = value;
    this.length = value.length;
    this.array = new Array(this.length).fill(0).map((_, x) => x)
    this.animates = new Array(this.length * 2 - 2).fill(0).map((_, x) => x).filter(x => (x <= this.length / 2 || x > (3 * this.length) / 2 - 2))

  }

  @Output() select: EventEmitter<number> = new EventEmitter<number>();

  cellWidth: number;
  marginTop: number = -(this.top * this.minScale - this.top) / 2;


  constructor(private builder: AnimationBuilder) { }

  indexToFront(index: any) {
    const pos = this.animates[index]
    if (pos != 0) {
      const steps = pos <= this.length / 2 ? -pos : 2 * this.length - 2 - pos
      const factor = steps < 0 ? -1 : 1;
      this.animateViews(factor, factor * steps)
    }
    this.select.emit(index);
  }

  animateViews(direction: number, steps: number = 1) {
    this.animates.forEach((x: number, index: number) => {
      const pos = this.getMovement(x, direction, steps, this.length);
      const time = this.timer / pos.length;
      const animations = pos.map((x) => this.getAnimation(x, this.length, time));
      const item = this.itemsView.find((_x, i) => i == index);

      const myAnimation = this.builder.build(animations);
      this.player = myAnimation.create(item?.nativeElement);
      this.player.onDone(() => {
        this.animates[index] = pos[pos.length - 1];
      });
      this.player.play();
    });
  }


  getMovement(posIni: number, incr: number, steps: number, length: number) {
    if (steps == 0) return [posIni];
    const pos = [];
    let index = posIni;
    let cont = 0;
    while (cont < steps) {
      index += incr / 2;
      index = (index + 2 * length - 2) % (2 * length - 2);
      if ((index * 2) % 2 == 0) {
        pos.push(index);
        if (index <= length / 2 || index > (3 * length) / 2 - 2) cont++;
      } else pos.push(index);
    }
    return pos;

  }

  getAnimation(pos: number, length: number, timer: number) {
    const angle = (pos * 2 * Math.PI) / (2 * length - 2);
    const scale =
      (1 + this.minScale) / 2 + ((1 - this.minScale) / 2) * Math.cos(angle);
    const applystyle = {
      transform:
        'translate(' +
        this.radius * Math.sin(angle) +
        'px,' +
        (Math.floor(this.top * scale) - this.top) +
        'px) scale(' +
        scale +
        ')',
      'z-index': Math.floor(100 * scale),
    };
    return animate(timer + 'ms', style(applystyle));
  }

  prev() {
    this.animateViews(1);
  }
  next() {
    this.animateViews(-1);
  }

  getDimensions(el: HTMLElement) {
    this.cellWidth = el.offsetWidth;
    this.radius = this.radius || this.cellWidth + 10;
    this.marginTop = -(this.top * this.minScale - this.top);
    this.animateViews(1, 0);
  }
}
