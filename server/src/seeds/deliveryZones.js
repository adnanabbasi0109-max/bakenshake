const deliveryZones = [
  {
    city: 'Bhopal',
    pincodes: [
      '462001', '462002', '462003', '462004', '462005', '462006', '462007', '462008',
      '462010', '462011', '462012', '462013', '462014', '462016', '462020', '462021',
      '462022', '462023', '462024', '462026', '462027', '462030', '462031', '462032',
      '462033', '462036', '462037', '462038', '462039', '462040', '462041', '462042',
      '462043', '462044', '462045', '462046', '462047',
    ],
    deliveryCharges: {
      freeAbove: 499,
      baseCharge: 49,
      perKmCharge: 5,
    },
    deliverySlots: [
      { dayOfWeek: 0, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 1, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 2, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 3, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 4, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 5, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 6, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
    ],
    isActive: true,
  },
  {
    city: 'Indore',
    pincodes: [
      '452001', '452002', '452003', '452004', '452005', '452006', '452007', '452008',
      '452009', '452010', '452011', '452012', '452013', '452014', '452015', '452016',
      '452018', '452020',
    ],
    deliveryCharges: {
      freeAbove: 499,
      baseCharge: 49,
      perKmCharge: 5,
    },
    deliverySlots: [
      { dayOfWeek: 0, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 1, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 2, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 3, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 4, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 5, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 6, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
    ],
    isActive: true,
  },
  {
    city: 'Gwalior',
    pincodes: [
      '474001', '474002', '474003', '474004', '474005', '474006', '474007', '474008',
      '474009', '474010', '474011', '474012', '474015',
    ],
    deliveryCharges: {
      freeAbove: 499,
      baseCharge: 59,
      perKmCharge: 6,
    },
    deliverySlots: [
      { dayOfWeek: 0, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 1, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 2, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 3, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 4, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 5, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
      { dayOfWeek: 6, timeRanges: [{ start: '10:00', end: '13:00' }, { start: '14:00', end: '17:00' }, { start: '18:00', end: '21:00' }] },
    ],
    isActive: true,
  },
];

module.exports = deliveryZones;
