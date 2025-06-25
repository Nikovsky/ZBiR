// @file: packages/types/src/fico-panel.ts

export type FicoMoneyValue = number | string | null
// SERVER >>> CLIENT --- GET
export interface FicoPanelEntryListDto {
  id: string
  ficoDate: Date
  ficoDescription: string
  bankDeposit: FicoMoneyValue
  bankWithdrawal: FicoMoneyValue
  createdBy: {
    id: string
    name?: string | null
    email: string
  }
  updatedAt: Date
}

export interface FicoPanelEntryDetailsDto extends FicoPanelEntryListDto {
  grantHq?: FicoMoneyValue
  grantEdu?: FicoMoneyValue
  grantMuni?: FicoMoneyValue
  incomeActions?: FicoMoneyValue
  incomeParticipantFee?: FicoMoneyValue
  donationPrivate?: FicoMoneyValue
  donationOrg?: FicoMoneyValue
  incomeOnePercent?: FicoMoneyValue
  incomeOther?: FicoMoneyValue

  expEquipment?: FicoMoneyValue
  expMaterials?: FicoMoneyValue
  expCleaning?: FicoMoneyValue
  expOtherMaterials?: FicoMoneyValue
  expEnergy?: FicoMoneyValue
  expPhone?: FicoMoneyValue
  expRent?: FicoMoneyValue
  expPost?: FicoMoneyValue
  expBank?: FicoMoneyValue
  expCourier?: FicoMoneyValue
  expServices?: FicoMoneyValue
  expSalary?: FicoMoneyValue
  expInsuranceOC?: FicoMoneyValue
  expInsuranceNNW?: FicoMoneyValue
  expTravel?: FicoMoneyValue
  expFood?: FicoMoneyValue
  expRewards?: FicoMoneyValue
  expTickets?: FicoMoneyValue
  expAccommodation?: FicoMoneyValue
  expTransport?: FicoMoneyValue
  expOther?: FicoMoneyValue

  updatedBy?: {
    id: string
    name?: string | null
    email: string
  }
}

// CLIENT >>> SERVER --- POST/PATCH/PUT/DELETE
export interface FicoPanelEntryCreateDto {
  campId: string
  ficoDate: Date
  ficoDescription: string

  bankDeposit?: FicoMoneyValue
  bankWithdrawal?: FicoMoneyValue

  grantHq?: FicoMoneyValue
  grantEdu?: FicoMoneyValue
  grantMuni?: FicoMoneyValue
  incomeActions?: FicoMoneyValue
  incomeParticipantFee?: FicoMoneyValue
  donationPrivate?: FicoMoneyValue
  donationOrg?: FicoMoneyValue
  incomeOnePercent?: FicoMoneyValue
  incomeOther?: FicoMoneyValue

  expEquipment?: FicoMoneyValue
  expMaterials?: FicoMoneyValue
  expCleaning?: FicoMoneyValue
  expOtherMaterials?: FicoMoneyValue
  expEnergy?: FicoMoneyValue
  expPhone?: FicoMoneyValue
  expRent?: FicoMoneyValue
  expPost?: FicoMoneyValue
  expBank?: FicoMoneyValue
  expCourier?: FicoMoneyValue
  expServices?: FicoMoneyValue
  expSalary?: FicoMoneyValue
  expInsuranceOC?: FicoMoneyValue
  expInsuranceNNW?: FicoMoneyValue
  expTravel?: FicoMoneyValue
  expFood?: FicoMoneyValue
  expRewards?: FicoMoneyValue
  expTickets?: FicoMoneyValue
  expAccommodation?: FicoMoneyValue
  expTransport?: FicoMoneyValue
  expOther?: FicoMoneyValue
}

export interface FicoPanelEntryUpdateDto extends FicoPanelEntryCreateDto {
  id: string
}

export interface FicoPanelEntryDeleteDto {
  id: string
}
