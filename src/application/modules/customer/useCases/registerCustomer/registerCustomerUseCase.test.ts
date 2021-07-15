import { RegisterCustomerUseCase } from "./index";
import { ICustomerRepository } from "../../contracts/ICustomerRepository";
import { mock } from "jest-mock-extended";
import { Customer } from "../../../../../domain/customer/Customer";
import applicationStatus from "../../../../shared/status/applicationStatusCodes";
import resources, { resourceKeys } from "../../../../shared/locals";


const customerRepositoryMock = mock<ICustomerRepository>();
const registerCustomerUseCase = new RegisterCustomerUseCase(customerRepositoryMock);

describe("Positive customer tests", () => {
    beforeAll(() => {
        resources.setDefaultLanguage("pt");
    });

    beforeEach(() => {
        customerRepositoryMock.getCustomerByEmail.mockReset();
        customerRepositoryMock.registerCustomer.mockReset();
    });

    it("Should return a success if the customer was registered", async () => {
        const customer = new Customer("Pedro", "Miotti", "pedromiotti7@gmail.com", "pedro123");
        customerRepositoryMock.getCustomerByEmail.mockResolvedValueOnce(null);
        customerRepositoryMock.registerCustomer.mockResolvedValueOnce(customer);

        const result = await registerCustomerUseCase.execute(customer);

        expect(result.success).toBeTruthy();
        expect(result.statusCode).toBe(applicationStatus.CREATED);
        expect(result.message).toBe(resources.get(resourceKeys.CUSTOMER_CREATED_SUCCESSFULLY));
    })
})

describe("Negative customer tests", () => {
    beforeAll(() => {
        resources.setDefaultLanguage("pt");
    });

    beforeEach(() => {
        customerRepositoryMock.getCustomerByEmail.mockReset();
        customerRepositoryMock.registerCustomer.mockReset();
    });

    it("should return a 400 error if customer with the same email already exists", async () => {
        const customer = new Customer("Pedro", "Miotti", "pedromiotti7@gmail.com", "pedro123");
        customerRepositoryMock.getCustomerByEmail.mockResolvedValueOnce(customer);

        const result = await registerCustomerUseCase.execute(customer);

        expect(result.success).toBeFalsy();
        expect(result.statusCode).toBe(applicationStatus.BAD_REQUEST);
        expect(result.error).toBe(
            resources.getWithParams(resourceKeys.EMAIL_ALREADY_IN_USE, {
                email: customer.email,
            }),
        );
    })
})