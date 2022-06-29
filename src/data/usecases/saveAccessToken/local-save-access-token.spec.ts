import { LocalSaveAccessToken } from "./local-save-access-token";
import { SetStorageSpy } from "@/data/test/mock-set-storage";
import faker from "@faker-js/faker";

describe("LocalSaveAccessToken", () => {
  test("Should call SetStorage with correct value", async () => {
    const setStorageSpy = new SetStorageSpy();
    const sut = new LocalSaveAccessToken(setStorageSpy);
    const accessToken = faker.datatype.uuid();
    await sut.save(accessToken);
    expect(setStorageSpy.key).toBe("accessToken");
    expect(setStorageSpy.value).toBe(accessToken);
  });
});