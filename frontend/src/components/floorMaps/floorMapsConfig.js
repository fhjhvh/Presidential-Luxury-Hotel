export const floorMapConfigs = {
  b2: {
    floorLabel: 'B2',
    nameKey: 'floorMaps.floors.b2.name',
    viewBox: '0 0 1000 520',
    zones: [
      {
        id: 'b2-valet',
        labelKey: 'floorMaps.floors.b2.zones.valet.label',
        hintKey: 'floorMaps.floors.b2.zones.valet.hint',
        shape: { type: 'rect', x: 40, y: 60, w: 220, h: 140, r: 18 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b2.zones.valet.title',
            subtitleKey: 'floorMaps.floors.b2.zones.valet.subtitle',
            images: [
              'https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=1600',
              'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b2.zones.valet.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.b2.zones.valet.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b2.zones.valet.meta.access' },
              { kKey: 'floorMaps.meta.process', vKey: 'floorMaps.floors.b2.zones.valet.meta.process' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' },
              { labelKey: 'floorMaps.actions.exploreChauffeur', type: 'route', to: '/services/chauffeur' }
            ]
          }
        }
      },
      {
        id: 'b2-ev',
        labelKey: 'floorMaps.floors.b2.zones.ev.label',
        hintKey: 'floorMaps.floors.b2.zones.ev.hint',
        shape: { type: 'rect', x: 300, y: 60, w: 250, h: 140, r: 18 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b2.zones.ev.title',
            subtitleKey: 'floorMaps.floors.b2.zones.ev.subtitle',
            images: [
              'https://images.unsplash.com/photo-1619767886558-efdc259cde1e?w=1600',
              'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b2.zones.ev.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.b2.zones.ev.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b2.zones.ev.meta.access' },
              { kKey: 'floorMaps.meta.security', vKey: 'floorMaps.floors.b2.zones.ev.meta.security' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      },
      {
        id: 'b2-vip',
        labelKey: 'floorMaps.floors.b2.zones.vip.label',
        hintKey: 'floorMaps.floors.b2.zones.vip.hint',
        shape: { type: 'rect', x: 590, y: 60, w: 370, h: 140, r: 18 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b2.zones.vip.title',
            subtitleKey: 'floorMaps.floors.b2.zones.vip.subtitle',
            images: [
              'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1600',
              'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b2.zones.vip.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.b2.zones.vip.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b2.zones.vip.meta.access' },
              { kKey: 'floorMaps.meta.transfer', vKey: 'floorMaps.floors.b2.zones.vip.meta.transfer' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' },
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }
            ]
          }
        }
      },
      {
        id: 'b2-security',
        labelKey: 'floorMaps.floors.b2.zones.security.label',
        hintKey: 'floorMaps.floors.b2.zones.security.hint',
        shape: { type: 'rect', x: 40, y: 240, w: 300, h: 230, r: 18 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b2.zones.security.title',
            subtitleKey: 'floorMaps.floors.b2.zones.security.subtitle',
            images: [
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600',
              'https://images.unsplash.com/photo-1600267185393-e158a98703de?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b2.zones.security.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b2.zones.security.meta.access' },
              { kKey: 'floorMaps.meta.coverage', vKey: 'floorMaps.floors.b2.zones.security.meta.coverage' },
              { kKey: 'floorMaps.meta.control', vKey: 'floorMaps.floors.b2.zones.security.meta.control' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }]
          }
        }
      },
      {
        id: 'b2-maint',
        labelKey: 'floorMaps.floors.b2.zones.maintenance.label',
        hintKey: 'floorMaps.floors.b2.zones.maintenance.hint',
        shape: { type: 'rect', x: 380, y: 240, w: 280, h: 230, r: 18 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b2.zones.maintenance.title',
            subtitleKey: 'floorMaps.floors.b2.zones.maintenance.subtitle',
            images: [
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600',
              'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b2.zones.maintenance.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b2.zones.maintenance.meta.access' },
              { kKey: 'floorMaps.meta.function', vKey: 'floorMaps.floors.b2.zones.maintenance.meta.function' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.b2.zones.maintenance.meta.availability' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      },
      {
        id: 'b2-elevators',
        labelKey: 'floorMaps.floors.b2.zones.guestElevators.label',
        hintKey: 'floorMaps.floors.b2.zones.guestElevators.hint',
        shape: { type: 'rect', x: 700, y: 240, w: 260, h: 230, r: 18 },
        interaction: {
          type: 'route',
          to: '/floors/0'
        }
      }
    ]
  },
  b1: {
    floorLabel: 'B1',
    nameKey: 'floorMaps.floors.b1.name',
    viewBox: '0 0 1000 520',
    zones: [
      {
        id: 'b1-laundry',
        labelKey: 'floorMaps.floors.b1.zones.laundry.label',
        hintKey: 'floorMaps.floors.b1.zones.laundry.hint',
        shape: { type: 'rect', x: 40, y: 60, w: 320, h: 180, r: 18 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b1.zones.laundry.title',
            subtitleKey: 'floorMaps.floors.b1.zones.laundry.subtitle',
            images: [
              'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1600',
              'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b1.zones.laundry.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b1.zones.laundry.meta.access' },
              { kKey: 'floorMaps.meta.capacity', vKey: 'floorMaps.floors.b1.zones.laundry.meta.capacity' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.b1.zones.laundry.meta.purpose' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreServiceRequests', type: 'route', to: '/dashboard/service-requests' }]
          }
        }
      },
      {
        id: 'b1-storage',
        labelKey: 'floorMaps.floors.b1.zones.storage.label',
        hintKey: 'floorMaps.floors.b1.zones.storage.hint',
        shape: { type: 'rect', x: 390, y: 60, w: 270, h: 180, r: 18 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b1.zones.storage.title',
            subtitleKey: 'floorMaps.floors.b1.zones.storage.subtitle',
            images: [
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600',
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b1.zones.storage.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b1.zones.storage.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.b1.zones.storage.meta.purpose' },
              { kKey: 'floorMaps.meta.security', vKey: 'floorMaps.floors.b1.zones.storage.meta.security' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      },
      {
        id: 'b1-housekeeping',
        labelKey: 'floorMaps.floors.b1.zones.housekeeping.label',
        hintKey: 'floorMaps.floors.b1.zones.housekeeping.hint',
        shape: { type: 'rect', x: 690, y: 60, w: 270, h: 180, r: 18 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b1.zones.housekeeping.title',
            subtitleKey: 'floorMaps.floors.b1.zones.housekeeping.subtitle',
            images: [
              'https://images.unsplash.com/photo-1529701870190-9ae4010fd124?w=1600',
              'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b1.zones.housekeeping.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b1.zones.housekeeping.meta.access' },
              { kKey: 'floorMaps.meta.operations', vKey: 'floorMaps.floors.b1.zones.housekeeping.meta.operations' },
              { kKey: 'floorMaps.meta.standard', vKey: 'floorMaps.floors.b1.zones.housekeeping.meta.standard' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.requestService', type: 'route', to: '/dashboard/service-requests' }]
          }
        }
      },
      {
        id: 'b1-service-elevators',
        labelKey: 'floorMaps.floors.b1.zones.serviceElevators.label',
        hintKey: 'floorMaps.floors.b1.zones.serviceElevators.hint',
        shape: { type: 'rect', x: 40, y: 270, w: 230, h: 200, r: 18 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.b1.zones.serviceElevators.title',
            subtitleKey: 'floorMaps.floors.b1.zones.serviceElevators.subtitle',
            images: [
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600',
              'https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.b1.zones.serviceElevators.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.b1.zones.serviceElevators.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.b1.zones.serviceElevators.meta.purpose' },
              { kKey: 'floorMaps.meta.design', vKey: 'floorMaps.floors.b1.zones.serviceElevators.meta.design' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewStaffResidences', type: 'route', to: '/floors/9' }]
          }
        }
      },
      {
        id: 'b1-additional-parking',
        labelKey: 'floorMaps.floors.b1.zones.additionalParking.label',
        hintKey: 'floorMaps.floors.b1.zones.additionalParking.hint',
        shape: { type: 'rect', x: 300, y: 270, w: 360, h: 200, r: 18 },
        interaction: {
          type: 'route',
          to: '/floors/b2'
        }
      },
      {
        id: 'b1-guest-core',
        labelKey: 'floorMaps.floors.b1.zones.guestCore.label',
        hintKey: 'floorMaps.floors.b1.zones.guestCore.hint',
        shape: { type: 'rect', x: 690, y: 270, w: 270, h: 200, r: 18 },
        interaction: {
          type: 'route',
          to: '/floors/0'
        }
      }
    ]
  },
  0: {
    floorLabel: '0',
    nameKey: 'floorMaps.floors.0.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f0-entrance',
        labelKey: 'floorMaps.floors.0.zones.entrance.label',
        hintKey: 'floorMaps.floors.0.zones.entrance.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 360, h: 180, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.0.zones.entrance.title',
            subtitleKey: 'floorMaps.floors.0.zones.entrance.subtitle',
            images: [
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600',
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.0.zones.entrance.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.0.zones.entrance.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.0.zones.entrance.meta.purpose' },
              { kKey: 'floorMaps.meta.flow', vKey: 'floorMaps.floors.0.zones.entrance.meta.flow' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      },
      {
        id: 'f0-reception',
        labelKey: 'floorMaps.floors.0.zones.reception.label',
        hintKey: 'floorMaps.floors.0.zones.reception.hint',
        shape: { type: 'rect', x: 430, y: 70, w: 260, h: 180, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.0.zones.reception.title',
            subtitleKey: 'floorMaps.floors.0.zones.reception.subtitle',
            images: [
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600',
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.0.zones.reception.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.0.zones.reception.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.0.zones.reception.meta.access' },
              { kKey: 'floorMaps.meta.services', vKey: 'floorMaps.floors.0.zones.reception.meta.services' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' },
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }
            ]
          }
        }
      },
      {
        id: 'f0-lounge',
        labelKey: 'floorMaps.floors.0.zones.lounge.label',
        hintKey: 'floorMaps.floors.0.zones.lounge.hint',
        shape: { type: 'rect', x: 720, y: 70, w: 240, h: 180, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.0.zones.lounge.title',
            subtitleKey: 'floorMaps.floors.0.zones.lounge.subtitle',
            images: [
              'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600',
              'https://images.unsplash.com/photo-1551887373-6c5bd8d3c62a?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.0.zones.lounge.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.0.zones.lounge.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.0.zones.lounge.meta.availability' },
              { kKey: 'floorMaps.meta.atmosphere', vKey: 'floorMaps.floors.0.zones.lounge.meta.atmosphere' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      },
      {
        id: 'f0-garden',
        labelKey: 'floorMaps.floors.0.zones.garden.label',
        hintKey: 'floorMaps.floors.0.zones.garden.hint',
        shape: { type: 'rect', x: 40, y: 290, w: 300, h: 220, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.0.zones.garden.title',
            subtitleKey: 'floorMaps.floors.0.zones.garden.subtitle',
            images: [
              'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1600',
              'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.0.zones.garden.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.0.zones.garden.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.0.zones.garden.meta.purpose' },
              { kKey: 'floorMaps.meta.design', vKey: 'floorMaps.floors.0.zones.garden.meta.design' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreSpaWellness', type: 'route', to: '/services/spa' }]
          }
        }
      },
      {
        id: 'f0-retail',
        labelKey: 'floorMaps.floors.0.zones.retail.label',
        hintKey: 'floorMaps.floors.0.zones.retail.hint',
        shape: { type: 'rect', x: 370, y: 290, w: 320, h: 220, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.0.zones.retail.title',
            subtitleKey: 'floorMaps.floors.0.zones.retail.subtitle',
            images: [
              'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=1600',
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.0.zones.retail.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.0.zones.retail.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.0.zones.retail.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.0.zones.retail.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }]
          }
        }
      },
      {
        id: 'f0-cafe',
        labelKey: 'floorMaps.floors.0.zones.cafe.label',
        hintKey: 'floorMaps.floors.0.zones.cafe.hint',
        shape: { type: 'rect', x: 720, y: 290, w: 240, h: 220, r: 22 },
        interaction: {
          type: 'route',
          to: '/restaurant'
        }
      }
    ]
  },
  1: {
    floorLabel: '1',
    nameKey: 'floorMaps.floors.1.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f1-main',
        labelKey: 'floorMaps.floors.1.zones.main.label',
        hintKey: 'floorMaps.floors.1.zones.main.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 500, h: 220, r: 22 },
        interaction: { type: 'route', to: '/restaurant' }
      },
      {
        id: 'f1-vip',
        labelKey: 'floorMaps.floors.1.zones.vip.label',
        hintKey: 'floorMaps.floors.1.zones.vip.hint',
        shape: { type: 'rect', x: 570, y: 70, w: 390, h: 220, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.1.zones.vip.title',
            subtitleKey: 'floorMaps.floors.1.zones.vip.subtitle',
            images: [
              'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600',
              'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.1.zones.vip.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.1.zones.vip.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.1.zones.vip.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.1.zones.vip.meta.service' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' },
              { labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }
            ]
          }
        }
      },
      {
        id: 'f1-cafe',
        labelKey: 'floorMaps.floors.1.zones.cafe.label',
        hintKey: 'floorMaps.floors.1.zones.cafe.hint',
        shape: { type: 'rect', x: 40, y: 320, w: 310, h: 200, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.1.zones.cafe.title',
            subtitleKey: 'floorMaps.floors.1.zones.cafe.subtitle',
            images: [
              'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1600',
              'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.1.zones.cafe.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.1.zones.cafe.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.1.zones.cafe.meta.access' },
              { kKey: 'floorMaps.meta.highlights', vKey: 'floorMaps.floors.1.zones.cafe.meta.highlights' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      },
      {
        id: 'f1-breakfast',
        labelKey: 'floorMaps.floors.1.zones.breakfast.label',
        hintKey: 'floorMaps.floors.1.zones.breakfast.hint',
        shape: { type: 'rect', x: 380, y: 320, w: 580, h: 200, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.1.zones.breakfast.title',
            subtitleKey: 'floorMaps.floors.1.zones.breakfast.subtitle',
            images: [
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600',
              'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.1.zones.breakfast.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.1.zones.breakfast.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.1.zones.breakfast.meta.access' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.1.zones.breakfast.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      }
    ]
  },
  2: {
    floorLabel: '2',
    nameKey: 'floorMaps.floors.2.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f2-grand-hall',
        labelKey: 'floorMaps.floors.2.zones.grandHall.label',
        hintKey: 'floorMaps.floors.2.zones.grandHall.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 620, h: 230, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.2.zones.grandHall.title',
            subtitleKey: 'floorMaps.floors.2.zones.grandHall.subtitle',
            images: [
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600',
              'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.2.zones.grandHall.description',
            meta: [
              { kKey: 'floorMaps.meta.capacity', vKey: 'floorMaps.floors.2.zones.grandHall.meta.capacity' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.2.zones.grandHall.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.2.zones.grandHall.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      },
      {
        id: 'f2-conference',
        labelKey: 'floorMaps.floors.2.zones.conference.label',
        hintKey: 'floorMaps.floors.2.zones.conference.hint',
        shape: { type: 'rect', x: 690, y: 70, w: 270, h: 230, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.2.zones.conference.title',
            subtitleKey: 'floorMaps.floors.2.zones.conference.subtitle',
            images: [
              'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600',
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.2.zones.conference.description',
            meta: [
              { kKey: 'floorMaps.meta.capacity', vKey: 'floorMaps.floors.2.zones.conference.meta.capacity' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.2.zones.conference.meta.availability' },
              { kKey: 'floorMaps.meta.support', vKey: 'floorMaps.floors.2.zones.conference.meta.support' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' },
              { labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }
            ]
          }
        }
      },
      {
        id: 'f2-meetings',
        labelKey: 'floorMaps.floors.2.zones.meetings.label',
        hintKey: 'floorMaps.floors.2.zones.meetings.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 450, h: 190, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.2.zones.meetings.title',
            subtitleKey: 'floorMaps.floors.2.zones.meetings.subtitle',
            images: [
              'https://images.unsplash.com/photo-1560438718-eb61ede255eb?w=1600',
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.2.zones.meetings.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.2.zones.meetings.meta.availability' },
              { kKey: 'floorMaps.meta.capacity', vKey: 'floorMaps.floors.2.zones.meetings.meta.capacity' },
              { kKey: 'floorMaps.meta.layouts', vKey: 'floorMaps.floors.2.zones.meetings.meta.layouts' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      },
      {
        id: 'f2-vip-suite',
        labelKey: 'floorMaps.floors.2.zones.vipSuite.label',
        hintKey: 'floorMaps.floors.2.zones.vipSuite.hint',
        shape: { type: 'rect', x: 520, y: 330, w: 440, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.2.zones.vipSuite.title',
            subtitleKey: 'floorMaps.floors.2.zones.vipSuite.subtitle',
            images: [
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600',
              'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.2.zones.vipSuite.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.2.zones.vipSuite.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.2.zones.vipSuite.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.2.zones.vipSuite.meta.service' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' },
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }
            ]
          }
        }
      }
    ]
  },
  3: {
    floorLabel: '3',
    nameKey: 'floorMaps.floors.3.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f3-gym',
        labelKey: 'floorMaps.floors.3.zones.gym.label',
        hintKey: 'floorMaps.floors.3.zones.gym.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 300, h: 220, r: 22 },
        interaction: { type: 'route', to: '/services/gym' }
      },
      {
        id: 'f3-spa',
        labelKey: 'floorMaps.floors.3.zones.spa.label',
        hintKey: 'floorMaps.floors.3.zones.spa.hint',
        shape: { type: 'rect', x: 370, y: 70, w: 360, h: 220, r: 22 },
        interaction: { type: 'route', to: '/services/spa' }
      },
      {
        id: 'f3-pool',
        labelKey: 'floorMaps.floors.3.zones.pool.label',
        hintKey: 'floorMaps.floors.3.zones.pool.hint',
        shape: { type: 'rect', x: 760, y: 70, w: 200, h: 220, r: 22 },
        interaction: { type: 'route', to: '/services/pool' }
      },
      {
        id: 'f3-sauna',
        labelKey: 'floorMaps.floors.3.zones.sauna.label',
        hintKey: 'floorMaps.floors.3.zones.sauna.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 380, h: 190, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.3.zones.sauna.title',
            subtitleKey: 'floorMaps.floors.3.zones.sauna.subtitle',
            images: [
              'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600',
              'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.3.zones.sauna.description',
            meta: [
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.3.zones.sauna.meta.availability' },
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.3.zones.sauna.meta.access' },
              { kKey: 'floorMaps.meta.use', vKey: 'floorMaps.floors.3.zones.sauna.meta.use' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.exploreSpaWellness', type: 'route', to: '/services/spa' },
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }
            ]
          }
        }
      },
      {
        id: 'f3-relax',
        labelKey: 'floorMaps.floors.3.zones.relax.label',
        hintKey: 'floorMaps.floors.3.zones.relax.hint',
        shape: { type: 'rect', x: 450, y: 330, w: 510, h: 190, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.3.zones.relax.title',
            subtitleKey: 'floorMaps.floors.3.zones.relax.subtitle',
            images: [
              'https://images.unsplash.com/photo-1551887373-6c5bd8d3c62a?w=1600',
              'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.3.zones.relax.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.3.zones.relax.meta.access' },
              { kKey: 'floorMaps.meta.atmosphere', vKey: 'floorMaps.floors.3.zones.relax.meta.atmosphere' },
              { kKey: 'floorMaps.meta.bestFor', vKey: 'floorMaps.floors.3.zones.relax.meta.bestFor' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreSpaWellness', type: 'route', to: '/services/spa' }]
          }
        }
      }
    ]
  },
  4: {
    floorLabel: '4',
    nameKey: 'floorMaps.floors.4.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f4-wing-a',
        labelKey: 'floorMaps.floors.4.zones.wingA.label',
        hintKey: 'floorMaps.floors.4.zones.wingA.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 300, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f4-wing-b',
        labelKey: 'floorMaps.floors.4.zones.wingB.label',
        hintKey: 'floorMaps.floors.4.zones.wingB.hint',
        shape: { type: 'rect', x: 370, y: 70, w: 300, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f4-wing-c',
        labelKey: 'floorMaps.floors.4.zones.wingC.label',
        hintKey: 'floorMaps.floors.4.zones.wingC.hint',
        shape: { type: 'rect', x: 700, y: 70, w: 260, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f4-service-core',
        labelKey: 'floorMaps.floors.4.zones.serviceCore.label',
        hintKey: 'floorMaps.floors.4.zones.serviceCore.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 430, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.4.zones.serviceCore.title',
            subtitleKey: 'floorMaps.floors.4.zones.serviceCore.subtitle',
            images: [
              'https://images.unsplash.com/photo-1529701870190-9ae4010fd124?w=1600',
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.4.zones.serviceCore.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.4.zones.serviceCore.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.4.zones.serviceCore.meta.purpose' },
              { kKey: 'floorMaps.meta.design', vKey: 'floorMaps.floors.4.zones.serviceCore.meta.design' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.requestService', type: 'route', to: '/dashboard/service-requests' }]
          }
        }
      },
      {
        id: 'f4-elevators',
        labelKey: 'floorMaps.floors.4.zones.elevators.label',
        hintKey: 'floorMaps.floors.4.zones.elevators.hint',
        shape: { type: 'rect', x: 500, y: 330, w: 460, h: 190, r: 22 },
        interaction: { type: 'route', to: '/floors/0' }
      }
    ]
  },
  5: {
    floorLabel: '5',
    nameKey: 'floorMaps.floors.5.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f5-city',
        labelKey: 'floorMaps.floors.5.zones.city.label',
        hintKey: 'floorMaps.floors.5.zones.city.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 420, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f5-garden',
        labelKey: 'floorMaps.floors.5.zones.garden.label',
        hintKey: 'floorMaps.floors.5.zones.garden.hint',
        shape: { type: 'rect', x: 490, y: 70, w: 470, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f5-lounge',
        labelKey: 'floorMaps.floors.5.zones.lounge.label',
        hintKey: 'floorMaps.floors.5.zones.lounge.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 560, h: 190, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.5.zones.lounge.title',
            subtitleKey: 'floorMaps.floors.5.zones.lounge.subtitle',
            images: [
              'https://images.unsplash.com/photo-1551887373-6c5bd8d3c62a?w=1600',
              'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.5.zones.lounge.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.5.zones.lounge.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.5.zones.lounge.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.5.zones.lounge.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }]
          }
        }
      },
      {
        id: 'f5-core',
        labelKey: 'floorMaps.floors.5.zones.core.label',
        hintKey: 'floorMaps.floors.5.zones.core.hint',
        shape: { type: 'rect', x: 630, y: 330, w: 330, h: 190, r: 22 },
        interaction: { type: 'route', to: '/floors/0' }
      }
    ]
  },
  6: {
    floorLabel: '6',
    nameKey: 'floorMaps.floors.6.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f6-premium',
        labelKey: 'floorMaps.floors.6.zones.premium.label',
        hintKey: 'floorMaps.floors.6.zones.premium.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 430, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f6-family',
        labelKey: 'floorMaps.floors.6.zones.family.label',
        hintKey: 'floorMaps.floors.6.zones.family.hint',
        shape: { type: 'rect', x: 500, y: 70, w: 460, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/deluxe' }
      },
      {
        id: 'f6-concierge',
        labelKey: 'floorMaps.floors.6.zones.concierge.label',
        hintKey: 'floorMaps.floors.6.zones.concierge.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 560, h: 190, r: 22 },
        interaction: { type: 'route', to: '/services/concierge' }
      },
      {
        id: 'f6-core',
        labelKey: 'floorMaps.floors.6.zones.core.label',
        hintKey: 'floorMaps.floors.6.zones.core.hint',
        shape: { type: 'rect', x: 630, y: 330, w: 330, h: 190, r: 22 },
        interaction: { type: 'route', to: '/floors/0' }
      }
    ]
  },
  7: {
    floorLabel: '7',
    nameKey: 'floorMaps.floors.7.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f7-exec',
        labelKey: 'floorMaps.floors.7.zones.exec.label',
        hintKey: 'floorMaps.floors.7.zones.exec.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 380, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/suite' }
      },
      {
        id: 'f7-luxury',
        labelKey: 'floorMaps.floors.7.zones.luxury.label',
        hintKey: 'floorMaps.floors.7.zones.luxury.hint',
        shape: { type: 'rect', x: 450, y: 70, w: 510, h: 220, r: 22 },
        interaction: { type: 'route', to: '/rooms/suite' }
      },
      {
        id: 'f7-royal',
        labelKey: 'floorMaps.floors.7.zones.royal.label',
        hintKey: 'floorMaps.floors.7.zones.royal.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 560, h: 190, r: 22 },
        interaction: { type: 'route', to: '/rooms/suite' }
      },
      {
        id: 'f7-butler',
        labelKey: 'floorMaps.floors.7.zones.butler.label',
        hintKey: 'floorMaps.floors.7.zones.butler.hint',
        shape: { type: 'rect', x: 630, y: 330, w: 330, h: 190, r: 22 },
        interaction: { type: 'route', to: '/premium-services' }
      }
    ]
  },
  8: {
    floorLabel: '8',
    nameKey: 'floorMaps.floors.8.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f8-suite',
        labelKey: 'floorMaps.floors.8.zones.suite.label',
        hintKey: 'floorMaps.floors.8.zones.suite.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 520, h: 230, r: 22 },
        restricted: true,
        interaction: { type: 'route', to: '/rooms/presidential' }
      },
      {
        id: 'f8-pool',
        labelKey: 'floorMaps.floors.8.zones.pool.label',
        hintKey: 'floorMaps.floors.8.zones.pool.hint',
        shape: { type: 'rect', x: 590, y: 70, w: 370, h: 230, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.8.zones.pool.title',
            subtitleKey: 'floorMaps.floors.8.zones.pool.subtitle',
            images: [
              'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1600',
              'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.8.zones.pool.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.8.zones.pool.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.8.zones.pool.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.8.zones.pool.meta.service' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' },
              { labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }
            ]
          }
        }
      },
      {
        id: 'f8-cinema',
        labelKey: 'floorMaps.floors.8.zones.cinema.label',
        hintKey: 'floorMaps.floors.8.zones.cinema.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 380, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.8.zones.cinema.title',
            subtitleKey: 'floorMaps.floors.8.zones.cinema.subtitle',
            images: [
              'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1600',
              'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.8.zones.cinema.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.8.zones.cinema.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.8.zones.cinema.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.8.zones.cinema.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }]
          }
        }
      },
      {
        id: 'f8-office',
        labelKey: 'floorMaps.floors.8.zones.office.label',
        hintKey: 'floorMaps.floors.8.zones.office.hint',
        shape: { type: 'rect', x: 450, y: 330, w: 510, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.8.zones.office.title',
            subtitleKey: 'floorMaps.floors.8.zones.office.subtitle',
            images: [
              'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600',
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.8.zones.office.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.8.zones.office.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.8.zones.office.meta.availability' },
              { kKey: 'floorMaps.meta.support', vKey: 'floorMaps.floors.8.zones.office.meta.support' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      }
    ]
  },
  9: {
    floorLabel: '9',
    nameKey: 'floorMaps.floors.9.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f9-accommodation',
        labelKey: 'floorMaps.floors.9.zones.accommodation.label',
        hintKey: 'floorMaps.floors.9.zones.accommodation.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 420, h: 220, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.9.zones.accommodation.title',
            subtitleKey: 'floorMaps.floors.9.zones.accommodation.subtitle',
            images: [
              'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600',
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.9.zones.accommodation.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.9.zones.accommodation.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.9.zones.accommodation.meta.purpose' },
              { kKey: 'floorMaps.meta.separation', vKey: 'floorMaps.floors.9.zones.accommodation.meta.separation' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewServiceRequests', type: 'route', to: '/dashboard/service-requests' }]
          }
        }
      },
      {
        id: 'f9-dining',
        labelKey: 'floorMaps.floors.9.zones.dining.label',
        hintKey: 'floorMaps.floors.9.zones.dining.hint',
        shape: { type: 'rect', x: 490, y: 70, w: 470, h: 220, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.9.zones.dining.title',
            subtitleKey: 'floorMaps.floors.9.zones.dining.subtitle',
            images: [
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600',
              'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.9.zones.dining.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.9.zones.dining.meta.access' },
              { kKey: 'floorMaps.meta.meals', vKey: 'floorMaps.floors.9.zones.dining.meta.meals' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.9.zones.dining.meta.purpose' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      },
      {
        id: 'f9-training',
        labelKey: 'floorMaps.floors.9.zones.training.label',
        hintKey: 'floorMaps.floors.9.zones.training.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 420, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.9.zones.training.title',
            subtitleKey: 'floorMaps.floors.9.zones.training.subtitle',
            images: [
              'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600',
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.9.zones.training.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.9.zones.training.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.9.zones.training.meta.purpose' },
              { kKey: 'floorMaps.meta.impact', vKey: 'floorMaps.floors.9.zones.training.meta.impact' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      },
      {
        id: 'f9-recreation',
        labelKey: 'floorMaps.floors.9.zones.recreation.label',
        hintKey: 'floorMaps.floors.9.zones.recreation.hint',
        shape: { type: 'rect', x: 490, y: 330, w: 470, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.9.zones.recreation.title',
            subtitleKey: 'floorMaps.floors.9.zones.recreation.subtitle',
            images: [
              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600',
              'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.9.zones.recreation.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.9.zones.recreation.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.9.zones.recreation.meta.purpose' },
              { kKey: 'floorMaps.meta.design', vKey: 'floorMaps.floors.9.zones.recreation.meta.design' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreWellnessFacilities', type: 'route', to: '/floors/3' }]
          }
        }
      }
    ]
  },
  10: {
    floorLabel: '10',
    nameKey: 'floorMaps.floors.10.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f10-helipad',
        labelKey: 'floorMaps.floors.10.zones.helipad.label',
        hintKey: 'floorMaps.floors.10.zones.helipad.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 520, h: 220, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.10.zones.helipad.title',
            subtitleKey: 'floorMaps.floors.10.zones.helipad.subtitle',
            images: [
              'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=1600',
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.10.zones.helipad.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.10.zones.helipad.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.10.zones.helipad.meta.availability' },
              { kKey: 'floorMaps.meta.flow', vKey: 'floorMaps.floors.10.zones.helipad.meta.flow' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' },
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' }
            ]
          }
        }
      },
      {
        id: 'f10-vip-reception',
        labelKey: 'floorMaps.floors.10.zones.vipReception.label',
        hintKey: 'floorMaps.floors.10.zones.vipReception.hint',
        shape: { type: 'rect', x: 590, y: 70, w: 370, h: 220, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.10.zones.vipReception.title',
            subtitleKey: 'floorMaps.floors.10.zones.vipReception.subtitle',
            images: [
              'https://images.unsplash.com/photo-1551887373-6c5bd8d3c62a?w=1600',
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.10.zones.vipReception.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.10.zones.vipReception.meta.access' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.10.zones.vipReception.meta.service' },
              { kKey: 'floorMaps.meta.transfer', vKey: 'floorMaps.floors.10.zones.vipReception.meta.transfer' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }]
          }
        }
      },
      {
        id: 'f10-control',
        labelKey: 'floorMaps.floors.10.zones.control.label',
        hintKey: 'floorMaps.floors.10.zones.control.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 420, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.10.zones.control.title',
            subtitleKey: 'floorMaps.floors.10.zones.control.subtitle',
            images: [
              'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?w=1600',
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.10.zones.control.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.10.zones.control.meta.access' },
              { kKey: 'floorMaps.meta.purpose', vKey: 'floorMaps.floors.10.zones.control.meta.purpose' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.10.zones.control.meta.availability' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }]
          }
        }
      },
      {
        id: 'f10-security',
        labelKey: 'floorMaps.floors.10.zones.security.label',
        hintKey: 'floorMaps.floors.10.zones.security.hint',
        shape: { type: 'rect', x: 490, y: 330, w: 470, h: 190, r: 22 },
        restricted: true,
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.10.zones.security.title',
            subtitleKey: 'floorMaps.floors.10.zones.security.subtitle',
            images: [
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600',
              'https://images.unsplash.com/photo-1600267185393-e158a98703de?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.10.zones.security.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.10.zones.security.meta.access' },
              { kKey: 'floorMaps.meta.coverage', vKey: 'floorMaps.floors.10.zones.security.meta.coverage' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.10.zones.security.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }]
          }
        }
      }
    ]
  },
  11: {
    floorLabel: '11',
    nameKey: 'floorMaps.floors.11.name',
    viewBox: '0 0 1000 560',
    zones: [
      {
        id: 'f11-pool',
        labelKey: 'floorMaps.floors.11.zones.pool.label',
        hintKey: 'floorMaps.floors.11.zones.pool.hint',
        shape: { type: 'rect', x: 40, y: 70, w: 460, h: 220, r: 22 },
        interaction: { type: 'route', to: '/services/pool' }
      },
      {
        id: 'f11-garden',
        labelKey: 'floorMaps.floors.11.zones.garden.label',
        hintKey: 'floorMaps.floors.11.zones.garden.hint',
        shape: { type: 'rect', x: 530, y: 70, w: 430, h: 220, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.11.zones.garden.title',
            subtitleKey: 'floorMaps.floors.11.zones.garden.subtitle',
            images: [
              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600',
              'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.11.zones.garden.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.11.zones.garden.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.11.zones.garden.meta.availability' },
              { kKey: 'floorMaps.meta.experience', vKey: 'floorMaps.floors.11.zones.garden.meta.experience' }
            ],
            actions: [
              { labelKey: 'floorMaps.actions.proceedToBooking', type: 'route', to: '/booking' },
              { labelKey: 'floorMaps.actions.viewPremiumServices', type: 'route', to: '/premium-services' }
            ]
          }
        }
      },
      {
        id: 'f11-skybar',
        labelKey: 'floorMaps.floors.11.zones.skybar.label',
        hintKey: 'floorMaps.floors.11.zones.skybar.hint',
        shape: { type: 'rect', x: 40, y: 330, w: 420, h: 190, r: 22 },
        interaction: {
          type: 'modal',
          content: {
            titleKey: 'floorMaps.floors.11.zones.skybar.title',
            subtitleKey: 'floorMaps.floors.11.zones.skybar.subtitle',
            images: [
              'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=1600',
              'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600'
            ],
            descriptionKey: 'floorMaps.floors.11.zones.skybar.description',
            meta: [
              { kKey: 'floorMaps.meta.access', vKey: 'floorMaps.floors.11.zones.skybar.meta.access' },
              { kKey: 'floorMaps.meta.availability', vKey: 'floorMaps.floors.11.zones.skybar.meta.availability' },
              { kKey: 'floorMaps.meta.service', vKey: 'floorMaps.floors.11.zones.skybar.meta.service' }
            ],
            actions: [{ labelKey: 'floorMaps.actions.exploreConcierge', type: 'route', to: '/services/concierge' }]
          }
        }
      },
      {
        id: 'f11-restaurant',
        labelKey: 'floorMaps.floors.11.zones.restaurant.label',
        hintKey: 'floorMaps.floors.11.zones.restaurant.hint',
        shape: { type: 'rect', x: 490, y: 330, w: 470, h: 190, r: 22 },
        interaction: { type: 'route', to: '/restaurant' }
      }
    ]
  }
};
