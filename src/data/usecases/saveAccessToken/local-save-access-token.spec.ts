import { SetStorageMock } from "@/data/test/mock-cache";
import { UnexpectedError } from "@/domain/error";
import faker from "@faker-js/faker";
import { LocalSaveAccessToken } from "./local-save-access-token";

type SutTypes = {
  sut: LocalSaveAccessToken;
  setStorageMock: SetStorageMock;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalSaveAccessToken(setStorageMock);
  return {
    setStorageMock,
    sut,
  };
};

describe("LocalSaveAccessToken", () => {
  test("Should call SetStorage with correct value", async () => {
    const { sut, setStorageMock } = makeSut();
    const accessToken = faker.datatype.uuid();
    await sut.save(accessToken);
    expect(setStorageMock.key).toBe("accessToken");
    expect(setStorageMock.value).toBe(accessToken);
  });

  test("Should throw exception if SetStorage throws exception", async () => {
    const { sut, setStorageMock } = makeSut();
    jest.spyOn(setStorageMock, "set").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.save(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new Error());
  });

  test("Should throw exception if accessToken is falsy", async () => {
    const { sut } = makeSut();
    const promise = sut.save(undefined);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
