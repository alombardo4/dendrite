import { CommandHandler, BaseCommand, CommandExecutionContext, CommandGateway } from '../../src';

describe('Command Gatway', () => {

  let handled = 0;

  class Command1 extends BaseCommand {
    identifier: string = 'command1';

  }

  class Command2 extends BaseCommand {
    identifier: string = 'command2';

  }
  class Handler1 extends CommandHandler<Command1> {
    identifier = 'command1';

    handle(context: CommandExecutionContext<Command1>): boolean {
      handled += 1;
      return true;
    }
  }

  class Handler2 extends CommandHandler<Command2> {
    identifier = 'command2';

    handle(context: CommandExecutionContext<Command2>): boolean {
      handled += 1;
      return true;
    }
  }

  beforeEach(() => {
    handled = 0;
  });

  it('constructor should register all command handler mappings', () => {
    // Arrange

    // Act
    const gateway = new CommandGateway([new Handler1(), new Handler2()]);

    // Assert
    const map: Map<string, CommandHandler<any>> = gateway['commandHandlerMappings'];
    expect(map.size).toBe(2);
  });

  it('constructor should not register duplicate mappings', () => {
    // Arrange

    // Act
    const gateway = new CommandGateway([new Handler1(), new Handler2(), new Handler1()]);

    // Assert
    const map: Map<string, CommandHandler<any>> = gateway['commandHandlerMappings'];
    expect(map.size).toBe(2);
  });

  it('register should register passed handler', () => {
    // Arrange
    const gateway = new CommandGateway([]);

    // Act
    gateway.register(new Handler1());

    // Assert
    expect(gateway['commandHandlerMappings'].size).toBe(1);
  });


  it('register should not register duplicate handler', () => {
    // Arrange
    const gateway = new CommandGateway([]);
    gateway.register(new Handler1());

    // Act
    gateway.register(new Handler1());

    // Assert
    expect(gateway['commandHandlerMappings'].size).toBe(1);
  });

  it('send should call sendAndWait asynchronously', (done) => {
    // Arrange
    const gateway = new CommandGateway([]);
    gateway.sendAndWait = jest.fn();

    // Act
    gateway.sendAndWait(new Command1());

    // Assert
    setTimeout(() => {
      expect((gateway.sendAndWait as jest.Mock<any>).mock.calls.length).toBe(1);
      done();
    });
  });

  it('sendAndWait should throw an error if a handler for the given command is not registered', () => {
    // Arrange
    const gateway = new CommandGateway([new Handler2()]);

    // Act & Assert
    try {
      expect(gateway.sendAndWait(new Command1())).toThrowError();
    } catch (e) {
      expect(e).not.toBeUndefined();
    }
  });

  it('sendAndWait should return true if handle was successful', () => {
    // Arrange
    const gateway = new CommandGateway([new Handler1()]);

    // Act
    const result = gateway.sendAndWait(new Command1());

    // Assert
    expect(result).toBe(true);
  });


});