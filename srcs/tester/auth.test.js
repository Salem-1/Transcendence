const { enable2FA, notValidEmail, submit2FaEmail}  = require("./auth_draft");
// const fetchMock = require('jest-fetch-mock');
// const fetchMock = setupFetchMock();


describe('HTTP Request Test', () => {
    it('fetches successfully data from an API', async () => {
      const expectedData = { data: 'some data' };
      const result = await enable2FA("hell0@fd.com");
      expect(result).toEqual(true);
    });
  });
  

test("enable2FA email input", async () => {
    await expect(enable2FA("ahmed")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("ahmed@email")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("a")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("a@")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("a@e")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("a@e.")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA()).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("ahmed@ahmed.cnasdclkjsabdvlkjbaskldjbvlkjabsdlkjvblkajsdbvlkjbasdlkjvblkasdbvlkjbasdlkvjblaskdjvblkjasdbvlkjdsb")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com'--")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com#")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com$")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com%")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com^")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com(")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com)")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@hack.com!")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("emailhack.com")).rejects.toThrow("Please enter a valid email address.");
    await expect(enable2FA("email@@hack.com")).rejects.toThrow("Please enter a valid email address.");
    expect(notValidEmail("email@email.com")).toBe(false);
    expect(notValidEmail("email@emailcom")).toEqual(true);
})

