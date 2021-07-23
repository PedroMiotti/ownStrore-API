import { mock } from "jest-mock-extended";
import { Customer } from "@/domain/customer/Customer";
import applicationStatus from "../../../../shared/status/applicationStatusCodes";
import resources, { resourceKeys } from "../../../../shared/locals";
import { ICustomerRepository } from "../../ports/ICustomerRepository";
import { GetCustomerByEmailUseCase } from './index';


const customerRepositoryMock = mock<ICustomerRepository>();
const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(customerRepositoryMock)

describe("Positive customer test", () => {

    beforeAll(() => {
        resources.setDefaultLanguage("pt");
    })

    beforeEach(() => {
        customerRepositoryMock.getCustomerByEmail.mockReset();
    });

    it("Should return success if the customer was found", async() => {
        const customer: Customer = new Customer("Pedro", "Miotti", "pedromiotti@hotmail.com", false, false, "pedro123");
        customerRepositoryMock.getCustomerByEmail.mockResolvedValueOnce(customer);

        const result = await getCustomerByEmailUseCase.execute("pedromiotti@hotmail");

        expect(result.success).toBeTruthy();
        expect(result.statusCode).toBe(applicationStatus.SUCCESS);
        expect(result.message).toBe(resources.get(resourceKeys.CUSTOMER_FOUND_SUCCESSFULLY));
    })

})

describe("Negative customer test", () => {

    beforeAll(() => {
        resources.setDefaultLanguage("pt");
    })

    beforeEach(() => {
        customerRepositoryMock.getCustomerById.mockReset();
    });

    it("Should return 400 if the customer email is not provided", async() => {

        const result = await getCustomerByEmailUseCase.execute(null);

        expect(result.success).toBeFalsy();
        expect(result.statusCode).toBe(applicationStatus.BAD_REQUEST);
        expect(result.error).toBe(
            resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
                missingParams: `email`,
            }),
        );
    });

    it("Should return 400 if the customer does not exists", async() => {
        customerRepositoryMock.getCustomerById.mockResolvedValueOnce(null);
        
        const result = await getCustomerByEmailUseCase.execute("pedromiotti@hotmail");

        expect(result.success).toBeFalsy();
        expect(result.statusCode).toBe(applicationStatus.BAD_REQUEST);
        expect(result.error).toBe(resources.get(resourceKeys.USER_DOESNT_EXISTS));
    })

})