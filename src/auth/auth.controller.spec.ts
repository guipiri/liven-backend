import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthDto, SignInWithCredentialsDto } from './auth.dto';
import { AuthService } from './auth.service';

const authDto: AuthDto = {
  token: 'token',
  expiresIn: 3600,
};
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signInWithCredentials: jest.fn().mockResolvedValue(authDto),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signInWithCredentials', () => {
    it('should return auth dto object with a jwt valid token', async () => {
      //Arrange
      const signInWithCredentialsDto: SignInWithCredentialsDto = {
        email: 'email',
        password: 'password',
      };
      //Act
      const res = await authController.signInWithCredentials(
        signInWithCredentialsDto,
      );

      expect(res).toEqual(authDto);
    });
    it('should throw an exception', async () => {
      //Arrange
      const signInWithCredentialsDto: SignInWithCredentialsDto = {
        email: 'email',
        password: 'password',
      };
      jest
        .spyOn(authService, 'signInWithCredentials')
        .mockRejectedValueOnce(new Error());
      //Act

      expect(
        authController.signInWithCredentials(signInWithCredentialsDto),
      ).rejects.toThrow(new Error());
    });
  });
});
