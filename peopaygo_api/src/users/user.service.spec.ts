import { Test, TestingModule } from "@nestjs/testing";
import UserService from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "./entities/user.entity";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { cannotEditAdmin, clientMustBelToComp, createUserData, createUserWithoutCompData, editUserAdminTestData, editUserTestData, existingUser, existingUserAdmin, saveUser, updatedUser, updatedUserAdmin, userAlreadyExistsError, userNotFound } from "src/test-data/user/service-data";

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  })

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  })

  describe('CreateUser', () => {
    it('should create a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(saveUser)
      const result = await userService.createUser(createUserData);

      expect(result).toEqual(saveUser);
    })

    it('should find a user and return error user already exists', async () => {
      // Found user
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(saveUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(saveUser);
      try {
        await userService.createUser(createUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(userAlreadyExistsError.status)
        expect(error.message).toBe(userAlreadyExistsError.message)
      }
    })

    it('should return error client must belong to a company', async () => {
      try {
        // User not found
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
        jest.spyOn(userRepository, 'save').mockResolvedValueOnce(saveUser)
        await userService.createUser(createUserWithoutCompData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(clientMustBelToComp.status)
        expect(error.message).toBe(clientMustBelToComp.message)
      }
    })
  })

  describe('EditUser', () => {
    it('should edit a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUser);

      const res = await userService.editUser(2, editUserTestData);
      expect(res).toEqual(updatedUser);
    })

    it('should send an error, you cannot edit an admin', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUserAdmin);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUserAdmin);

      try {
        await userService.editUser(2, editUserAdminTestData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(cannotEditAdmin.status)
        expect(error.message).toBe(cannotEditAdmin.message)
      }
    })

    it('should send an error, user does not exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(updatedUser);

      try {
        await userService.editUser(2, editUserTestData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(userNotFound.status)
        expect(error.message).toBe(userNotFound.message)
      }
    })
  })

  describe('FindUserById', () => {
    it('should find a user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(saveUser);
      const result = await userService.findUserById(14);

      expect(result).toEqual(saveUser);
    })

    it('should not find a user', async () => {

      // Simulating findOne found nothing
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
      try {
        await userService.findUserById(144);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(userNotFound.status)
        expect(error.message).toBe(userNotFound.message)
      }
    })
  })
})
