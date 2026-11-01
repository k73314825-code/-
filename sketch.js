// 스케치 1: 시선의 중력 (최종 완성본)
let walkers = [];

function setup() {
  createCanvas(600, 600);
  // 사방에서 끌려오는 여러 개의 Walker 생성
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let x = width / 2 + cos(angle) * 200;
    let y = height / 2 + sin(angle) * 200;
    walkers.push(new EyeWalker(x, y));
  }
}

function draw() {
  background(240, 40); // 잔상 효과

  // 마우스 위치 (시선의 중심) 시각화
  fill(0);
  noStroke();
  circle(mouseX, mouseY, 15);
  
  for (let w of walkers) {
    w.update();
    w.checkEdges(); // [움직임 2: 벽과의 상호작용 추가]
    w.display();
  }
}

class EyeWalker {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(mouse, this.pos);
    let d = dir.mag();

    dir.normalize();

    // [움직임 1: 속성의 변주]
    // 마우스와의 거리에 따라 끌어당기는 힘의 세기가 변화함
    let forceStrength = map(d, 0, width, 0.5, 0.05);

    // [움직임 3: 입력과 상호작용 (확장)]
    // 평소에는 끌려오지만, 마우스를 누르면(mouseIsPressed) 반대 방향으로 밀려남(척력)
    if (mouseIsPressed) {
      dir.mult(-forceStrength * 2); // 튕겨 나가는 힘
    } else {
      dir.mult(forceStrength);      // 끌려오는 힘
    }
    
    this.acc = dir;

    // 자율성/저항 노이즈 추가
    let noiseForce = p5.Vector.random2D();
    noiseForce.mult(0.15);
    this.acc.add(noiseForce);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
  }

  // [움직임 2: 벽과의 상호작용 메서드 추가]
  checkEdges() {
    // 캔버스 경계에 부딪히면 튕겨 나가도록 속도 반전 (반발 계수 0.8 적용)
    if (this.pos.x < 10 || this.pos.x > width - 10) {
      this.vel.x *= -0.8;
      this.pos.x = constrain(this.pos.x, 10, width - 10);
    }
    if (this.pos.y < 10 || this.pos.y > height - 10) {
      this.vel.y *= -0.8;
      this.pos.y = constrain(this.pos.y, 10, height - 10);
    }
  }

  display() {
    // 마우스 방향 시선 가이드 선
    stroke(200, 50, 50, 100);
    line(this.pos.x, this.pos.y, mouseX, mouseY);

    // 눈동자/입자 형태
    stroke(0);
    fill(100, 150, 255);
    circle(this.pos.x, this.pos.y, 20);
    fill(0);
    circle(this.pos.x, this.pos.y, 8);
  }
}
