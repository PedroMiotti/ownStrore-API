import { userRepository, addressRepository } from "@/adapter/repositories/container";
import { AddAddressUseCase } from "@/application/modules/address/useCases/addAddress";
import {DeleteAddressUseCase} from "@/application/modules/address/useCases/deleteAddress";
import {UpdateAddressUseCase} from "@/application/modules/address/useCases/updateAddress";


const addAddressUseCase = new AddAddressUseCase(addressRepository, userRepository);
const deleteAddressUseCase = new DeleteAddressUseCase(addressRepository);
const updateAddressUseCase = new UpdateAddressUseCase(addressRepository);

export { addAddressUseCase, deleteAddressUseCase, updateAddressUseCase };