import { Test, TestingModule } from "@nestjs/testing"
import UserController from "./user.controller";
import UserService from "./user.service";
import * as request from 'supertest';
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "./entities/user.entity";
import { Repository } from "typeorm";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import {
  createUserData,
  editUserTestData,
  existingUserController,
  saveUser,
  saveUserController,
  updatedUserController
} from "src/test-data/user/controller-data";

describe('UserController', () => {
  let app: INestApplication;
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);
  let authGuard: AuthGuard;
  let rolesGuard: RolesGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, {
        provide: userRepositoryToken,
        useClass: Repository,
      },]
    })
      .compile();

    app = module.createNestApplication();
    await app.init()
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    authGuard = module.get<AuthGuard>(AuthGuard)
    rolesGuard = module.get<RolesGuard>(RolesGuard)
  })

  it('Should be defined', () => {
    expect(userController).toBeDefined();
  })

  describe('CreateUser', () => {
    it('Should create a user', async () => {
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(saveUser)
      const response = await request(app.getHttpServer()).post('/user').send(createUserData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(saveUserController);
    })

    it('Should not create a user, get an error', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce(saveUser)
        await request(app.getHttpServer()).post('/user').send(createUserData);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    })
  })

  describe('EditUser', () => {
    it('Should edit a user', async () => {
      jest.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(true)
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUserController);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUserController)
      const response = await request(app.getHttpServer()).put('/user/2').send(editUserTestData);
      const expectedCreatedAt = new Date(existingUserController.createdAt);
      const expectedUpdatedAt = new Date(existingUserController.updated_at);

      expect(response.status).toBe(HttpStatus.OK);
      expect({
        ...response.body,
        createdAt: new Date(response.body.createdAt),
        updated_at: new Date(response.body.updated_at),
      }).toEqual({
        ...updatedUserController,
        createdAt: expectedCreatedAt,
        updated_at: expectedUpdatedAt,
      });
    })

    it('Should not edit a user, send an error', async () => {
      try {
        jest.spyOn(authGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(rolesGuard, 'canActivate').mockResolvedValue(false)
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUserController);
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUserController)
        await request(app.getHttpServer()).put('/user/2').send(editUserTestData);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    })
  })
})