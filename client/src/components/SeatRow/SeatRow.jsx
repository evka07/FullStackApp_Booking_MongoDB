import React from 'react';

export default function SeatRow({
                                    rowNumber,
                                    seatsCount,
                                    selectedSeats = [],
                                    onToggleSeat,
                                    bookedSeats = [],
                                    seatPrice,
                                }) {

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                justifyContent: 'center',
                marginBottom: 8,
            }}
            aria-label={`Row ${rowNumber}`}
            role="group"
        >
            {/* Нумерация ряда слева */}
            <div
                style={{
                    width: 24,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    userSelect: 'none',
                }}
                aria-hidden="true"
            >
                {rowNumber}
            </div>

            {/* Места ряда */}
            {[...Array(seatsCount)].map((_, seatIndex) => {
                const seatId = `${rowNumber}-${seatIndex + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isBooked = bookedSeats.includes(seatId);

                return (
                    <div
                        key={seatId}
                        onClick={() => !isBooked && onToggleSeat(rowNumber, seatIndex + 1)}
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: isBooked
                                ? '#888' // забронировано — серый, не кликабельный
                                : isSelected
                                    ? '#0066ff'
                                    : '#ddd',
                            borderRadius: 6,
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            color: isBooked ? '#444' : isSelected ? 'white' : 'black',
                            userSelect: 'none',
                            border: '1px solid #bbb',
                            transition: 'background-color 0.2s',
                            position: 'relative',
                        }}
                        title={
                            isBooked
                                ? `Row ${rowNumber} Seat ${seatIndex + 1} (Booked)`
                                : `Row ${rowNumber} Seat ${seatIndex + 1} — $${seatPrice}`
                        }
                        aria-pressed={isSelected}
                        aria-disabled={isBooked}
                        role="button"
                        tabIndex={isBooked ? -1 : 0}
                        onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && !isBooked) {
                                onToggleSeat(rowNumber, seatIndex + 1);
                            }
                        }}
                    >
                        <span>{seatIndex + 1}</span>
                        {/* Цена под номером */}
                        <small
                            style={{
                                fontSize: 10,
                                color: isBooked ? '#555' : '#333',
                                marginTop: 2,
                            }}
                        >
                            ${seatPrice}
                        </small>
                    </div>
                );
            })}

            {/* Нумерация ряда справа */}
            <div
                style={{
                    width: 24,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    userSelect: 'none',
                }}
                aria-hidden="true"
            >
                {rowNumber}
            </div>
        </div>
    );
}
