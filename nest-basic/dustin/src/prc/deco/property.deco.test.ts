function format(formatString: string) {
  return function (target: any, propertyKey: string): any {
    let value = target[propertyKey];

    function getter() {
      return `${formatString} ${value}`;
    }

    function setter(newVal: String) {
      value = newVal;
    }

    return {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    };
  };
}

class Greeter2 {
  @format('Hello')
  greeting: string;
}

const t2 = new Greeter2();

t2.greeting = 'World';

console.log(t2.greeting);
