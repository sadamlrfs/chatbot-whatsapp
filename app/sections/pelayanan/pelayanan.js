async function pelayananJaminan(wa, to) {
  const list_message = {
    type: 'list',
    header: {
      type: 'text',
      text: 'PELAYANAN KLAIM JAMINAN'
    },
    body: {
      text: 'Silahkan pilih jaminan yang ingin anda klaim'
    },
    action: {
      button: 'Lihat Pilihan',
      sections: [
        {
          title: 'Menu Pelayanan Klaim',
          rows: [
            {
              id: 'klaim_jht',
              title: 'Klaim JHT',
              description: ''
            },
            {
              id: 'klaim_jkk',
              title: 'Klaim JKK',
              description: ''
            },
            {
              id: 'klaim_jkm',
              title: 'Klaim JKM',
              description: ''
            },
            {
              id: 'klaim_jp',
              title: 'Klaim JP',
              description: ''
            },
            {
              id: 'klaim_jkp',
              title: 'Klaim JKP',
              description: ''
            }
          ]
        }
      ]
    }
  };

  await wa.messages.interactive(list_message, to);
}

module.exports = pelayananJaminan;
