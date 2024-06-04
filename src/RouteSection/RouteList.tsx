import React, { FC, useEffect, useState, useCallback } from "react";
import { RouteItem } from "./RouteItem";
import { RouteListType } from '../schema/Utils'
import data from '../data/data.json';

const RouteList = () => {
  const [routeListData, seRouteListData] = useState<RouteListType>([{ id: 0, window: [0, 0], steps: [[0, 0]] }])
  const [unionWindow, setUnionWindow] = useState<number[]>([0, 0])
  const [baseTime, setBaseTime] = useState<string[]>([
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '19:00', '20:00', '21:00', '22:00',
    '23:00'
  ])
  const [draggedStep, setDraggedStep] = useState([0, 0])
  const [dropStep, setDropStep] = useState([0, 0])
  const [zoom, setZoom] = useState(100)
  const [draggedRouteId, setDraggedRouteId] = useState(0)
  const [dragOverRouteId, setDragOverRouteId] = useState(0)
  const [canDrop, setCanDrop] = useState(true)

  useEffect(() => {
    seRouteListData(data)
  }, [])

  useEffect(() => {
    routeListData[0].id !== 0 && setUnionWindow([
      Math.min(...routeListData.map(i => i.window[0])),
      Math.max(...routeListData.map(i => i.window[1]))
    ])
  }, [routeListData])

  useEffect(() => {

    unionWindow[0] !== 0 && setBaseTime(baseTime.filter(item =>
      item >= `0${new Date(unionWindow[0]).getHours()}:00` &&
      item <= `${new Date(unionWindow[1]).getHours()}:00`
    ))

  }, [unionWindow])

  const removeService = useCallback(() => {
    seRouteListData((data) =>
      data.map((route) => draggedRouteId == route.id ?
        {
          ...route,
          steps: route.steps.filter((s) => s[0] != draggedStep[0])
        }
        :
        route
      )
    )
  }, [dragOverRouteId])

  const addService = useCallback((step: number[]) => {
    seRouteListData((data) =>
      data.map((route) => dragOverRouteId == route.id ?
        {
          ...route,
          steps: [...route.steps, step].sort((a, b) => a[0] - b[0])
        }
        :
        route
      )
    )
  }, [dragOverRouteId])

  return (<div className='w-100' style={{ width: `${zoom - 10}vw` }}>
    <div className="flex bg-gray-200 p-1">
      <div className="flex w-14">
        #
      </div>

      <div className="flex-none w-32">
        Fleet Actor
      </div>

      <div className="flex-none w-32">
        Load %
      </div>
      <div className="relative flex flex-1 content-center">
        {
          baseTime.filter((_, index) => index % Math.ceil(100 / zoom) === 0)
            .map((timeItem, index) =>
              <div key={timeItem + index}
                style={{
                  left: `${(index) * 100 / baseTime
                    .filter((_, index) => index % Math.ceil(100 / zoom) === 0).length}%`,
                }}
                className="absolute flex-none ">
                {timeItem}
              </div>
            )
        }
      </div>
    </div>
    <div onWheel={e => e.altKey &&
      (
        e.deltaY > 0 ?
          zoom < 150 && setZoom(zoom + 5) :
          zoom > 45 && setZoom(zoom - 5)
      )}
    >
      {routeListData.map((item, index) => <div>
        <RouteItem
          key={index + 'row'}
          item={item}
          index={index}
          unionWindow={unionWindow}
          sumWindow={(unionWindow[1] - unionWindow[0])}
          draggedStep={draggedStep}
          setDraggedStep={setDraggedStep}
          draggedRouteId={draggedRouteId}
          setDraggedRouteId={setDraggedRouteId}
          dragOverRouteId={dragOverRouteId}
          setDragOverRouteId={setDragOverRouteId}
          removeService={removeService}
          addService={addService}
          canDrop={canDrop}
          setCanDrop={setCanDrop}
          dropStep={dropStep}
          setDropStep={setDropStep}
        />
      </div>)}
    </div>

  </div>
  )
}

export { RouteList }