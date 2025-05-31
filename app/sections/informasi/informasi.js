async function informasiPelayanan(wa, to) {
  const list_message = {
    type: 'list',
    header: {
      type: 'text',
      text: 'INFORMASI KEPESERTAAN DAN PELAYANAN'
    },
    body: {
      text: 'Silahkan pilih informasi kepesertaan dan pelayanan yang diinginkan'
    },
    action: {
      button: 'Lihat Pilihan',
      sections: [
        {
          title: 'Menu Pelayanan Informasi',
          rows: [
            {
              id: 'info_saldo',
              title: 'Informasi Saldo',
              description: ''
            },
            {
              id: 'info_nomor',
              title: 'Informasi Nomor Kartu',
              description: ''
            },
            {
              id: 'info_iuran',
              title: 'Informasi Iuran',
              description: ''
            },
            {
              id: 'info_tagihan',
              title: 'Informasi Tagihan',
              description: ''
            },
            {
              id: 'info_rs',
              title: 'Informasi RS Kerjasama',
              description: ''
            }
          ]
        }
      ]
    }
  };

  await wa.messages.interactive(list_message, to);
}

module.exports = informasiPelayanan;
