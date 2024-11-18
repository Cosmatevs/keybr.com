import { equal, throws } from "node:assert/strict";
import { describe, it, test } from "node:test";
import { parseColor } from "./parse.ts";

test("validate", () => {
  throws(() => {
    parseColor("?");
  });
  throws(() => {
    parseColor("#");
  });
  throws(() => {
    parseColor("#ff");
  });
  throws(() => {
    parseColor("#ff f");
  });
  throws(() => {
    parseColor("rgb");
  });
  throws(() => {
    parseColor("rgb()");
  });
});

describe("parse angle", () => {
  it("should wrap around", () => {
    equal(parseColor("hsl(+100.0 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(+460.0 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(-100.0 0% 0%)").format(), "hsl(260 0% 0%)");
    equal(parseColor("hsl(-460.0 0% 0%)").format(), "hsl(260 0% 0%)");
  });

  it("should parse percent unit", () => {
    equal(parseColor("hsl(+25.00% 0% 0%)").format(), "hsl(90 0% 0%)");
    equal(parseColor("hsl(+50.00% 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(+100.00% 0% 0%)").format(), "hsl(360 0% 0%)");
    equal(parseColor("hsl(-50.0% 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(-100.00% 0% 0%)").format(), "hsl(0 0% 0%)");
  });

  it("should parse degree unit", () => {
    equal(parseColor("hsl(+180.00deg 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(+360.00deg 0% 0%)").format(), "hsl(360 0% 0%)");
    equal(parseColor("hsl(-180.00deg 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(-360.00deg 0% 0%)").format(), "hsl(0 0% 0%)");
  });

  it("should parse radian unit", () => {
    equal(parseColor("hsl(+3.141592653rad 0% 0%)").format(), "hsl(180 0% 0%)");
    equal(parseColor("hsl(-3.141592653rad 0% 0%)").format(), "hsl(180 0% 0%)");
  });
});

describe("parse percent", () => {
  it("should clamp", () => {
    equal(parseColor("hsl(0 +123.456% -123.456%)").format(), "hsl(0 100% 0%)");
  });
});

describe("parse number", () => {
  it("should parse scientific notation", () => {
    equal(parseColor("hsl(+1e2 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(+1E2 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(-1.000e2 0% 0%)").format(), "hsl(260 0% 0%)");
    equal(parseColor("hsl(-1.000E2 0% 0%)").format(), "hsl(260 0% 0%)");
    equal(parseColor("hsl(+1E+2 0% 0%)").format(), "hsl(100 0% 0%)");
    equal(parseColor("hsl(+1000E-1 0% 0%)").format(), "hsl(100 0% 0%)");
  });
});

test("hex", () => {
  equal(parseColor("#123").toRgb().formatHex(), "#112233");
  equal(parseColor("#1234").toRgb().formatHex(), "#11223344");
  equal(parseColor("#112233").toRgb().formatHex(), "#112233");
  equal(parseColor("#11223344").toRgb().formatHex(), "#11223344");
});

test("rgb", () => {
  equal(parseColor("rgb(none none none)").format(), "rgb(0 0 0)");
  equal(parseColor("rgb(none none none/none)").format(), "rgb(0 0 0)");

  equal(parseColor("rgb(17 34 51)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(17 34 51/0.5)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(17 34 51/0.5)").format(), "rgb(17 34 51/0.5)");

  equal(parseColor("rgb(6.66% 13.33% 20%)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(6.66% 13.33% 20%/50%)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(6.66% 13.33% 20%/50%)").format(), "rgb(17 34 51/0.5)");
});

test("legacy rgb", () => {
  equal(parseColor("rgb(17,34,51)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(17,34,51,0.5)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(17,34,51,0.5)").format(), "rgb(17 34 51/0.5)");

  equal(parseColor("rgb(6.66%,13.33%,20%)").format(), "rgb(17 34 51)");
  equal(parseColor("rgb(6.66%,13.33%,20%,50%)").format(), "rgb(17 34 51/0.5)");
  equal(parseColor("rgba(6.66%,13.33%,20%,50%)").format(), "rgb(17 34 51/0.5)");
});

test("hsl", () => {
  equal(parseColor("hsl(none none none)").format(), "hsl(0 0% 0%)");
  equal(parseColor("hsl(none none none/none)").format(), "hsl(0 0% 0%)");

  equal(parseColor("hsl(180 10 20)").format(), "hsl(180 10% 20%)");
  equal(parseColor("hsl(180 10 20/0.5)").format(), "hsl(180 10% 20%/0.5)");
  equal(parseColor("hsla(180 10 20/0.5)").format(), "hsl(180 10% 20%/0.5)");

  equal(parseColor("hsl(180 10% 20%)").format(), "hsl(180 10% 20%)");
  equal(parseColor("hsl(180 10% 20%/0.5)").format(), "hsl(180 10% 20%/0.5)");
  equal(parseColor("hsla(180 10% 20%/0.5)").format(), "hsl(180 10% 20%/0.5)");
});

test("legacy hsl", () => {
  equal(parseColor("hsl(180,40%,30%)").format(), "hsl(180 40% 30%)");
  equal(parseColor("hsl(180,40%,30%,0.5)").format(), "hsl(180 40% 30%/0.5)");
  equal(parseColor("hsla(180,40%,30%,0.5)").format(), "hsl(180 40% 30%/0.5)");
});

test("whitespace", () => {
  equal(parseColor("  #123  ").toRgb().format(), "rgb(17 34 51)");
  equal(parseColor("  rgb  (  1  2  3  )  ").format(), "rgb(1 2 3)");
  equal(parseColor("  rgb  (  1 , 2 , 3  )  ").format(), "rgb(1 2 3)");
  equal(parseColor("  hsl  (  1  2%  3%  )  ").format(), "hsl(1 2% 3%)");
  equal(parseColor("  hsl  (  1 , 2% , 3%  )  ").format(), "hsl(1 2% 3%)");
});