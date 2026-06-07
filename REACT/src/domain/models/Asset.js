export class Asset {
  constructor(rawData, type) {
    this.id = rawData.id;
    this.type = type;
    this.name = rawData.name;
    this.manufacturerId = rawData.manufacturers_id;
    this.modelId = this.getModelId(rawData, type);
    this.serial = rawData.serial;
    this.inventoryNumber = rawData.otherserial;
    this.locationId = rawData.locations_id;
    this.stateId = rawData.states_id;
    this.rawData = rawData;
  }

  getModelId(rawData, type) {
    const modelFields = {
      Computer: 'computermodels_id',
      Printer: 'printermodels_id',
      Monitor: 'monitormodels_id',
      NetworkEquipment: 'networkequipmentmodels_id',
      Phone: 'phonemodels_id',
      Peripheral: 'peripheralmodels_id'
    };
    return rawData[modelFields[type]] || null;
  }
}