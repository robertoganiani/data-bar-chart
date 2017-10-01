const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const width = 1200
const height = 700
const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 55
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

d3.json(dataUrl, content => {
  const { data } = content

  data.map(d => {
    d[0] = new Date(d[0])
  })

  // scales for x
  const xExtent = d3.extent(data, d => d[0]) // find min and max date

  const xScale = d3.scaleTime()
    .domain(xExtent)
    .range([margin.left, width - margin.right])

  // scale for y
  const yMax = d3.max(data, d => d[1]) // find max income

  const yScale = d3.scaleLinear()
    .domain([0, yMax]) // start from zero despite minimum
    .range([height - margin.bottom, margin.top])

  // define axis 
  const xAxis = d3.axisBottom()
    .scale(xScale)

  const yAxis = d3.axisLeft()
    .scale(yScale)

  // render chart 
  const svg = d3.select('svg')

  const rect = svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('width', 7)
    .attr('height', d => height - margin.top - yScale(d[1]))
    .attr('fill', '#4385F5')
    .attr('x', d => xScale(d[0]))
    .attr('y', d => yScale(d[1]))

  // append axis to chart
  svg.append('g')
    .attr('transform', `translate(${[0, height - margin.bottom]})`)
    .call(xAxis)

  svg.append('g')
    .attr('transform', `translate(${[margin.left, 0]})`)
    .call(yAxis)

  // show/hide tooltipe on mouse hover
  const formatCurrency = d3.format('$,.2f')

  const divTooltip = d3.select('body')
    .append('div')
    .attr('class', 'tool-tip')

  rect.on('mousemove', function (d) { // because of we need 'this'
    d3.select(this).attr('fill', '#000')
    divTooltip.style('left', d3.event.pageX + 10 + 'px')
    divTooltip.style('top', d3.event.pageY - 25 + 'px')
    divTooltip.style('display', 'inline-block')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 1)
    divTooltip.html(`${months[d[0].getMonth()]} ${d[0].getFullYear()}: ${formatCurrency(d[1])} Billion`)
  })

  rect.on('mouseout', function (d) { // because of we need 'this'
    d3.select(this).attr('fill', '#4385F5')
    divTooltip.style('display', 'none')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 0)
  })

  // style elements
  d3.selectAll('text')
    .attr('fill', '#fff')
    .attr('font-size', '15')

})
